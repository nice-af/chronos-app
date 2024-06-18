#include "ContextMenuNativeModule-win.h"

#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.UI.Core.h>
#include <winrt/Windows.UI.Xaml.Controls.Primitives.h>
#include <winrt/Windows.UI.Xaml.Controls.h>

namespace winrt {
using namespace winrt::Windows::UI::Core;
using namespace winrt::Windows::UI::Xaml;
using namespace winrt::Windows::UI::Xaml::Controls;
using namespace winrt::Windows::UI::Xaml::Controls::Primitives;
using namespace winrt::Windows::Foundation;
using namespace winrt::Windows::Foundation::Collections;
} // namespace winrt

static const std::unordered_map<std::string, winrt::FlyoutPlacementMode> placementMap = {
    {"top-left", winrt::FlyoutPlacementMode::TopEdgeAlignedLeft},
    {"top-right", winrt::FlyoutPlacementMode::TopEdgeAlignedRight},
    {"bottom-left", winrt::FlyoutPlacementMode::BottomEdgeAlignedLeft},
    {"bottom-right", winrt::FlyoutPlacementMode::BottomEdgeAlignedRight},
};

void ContextMenuNativeModule::initialize(React::ReactContext const& reactContext) noexcept {
  m_context = reactContext;
}

void ContextMenuNativeModule::showMenu(
    const int target,
    const std::string placement,
    const React::JSValueArray items,
    const std::function<void(React::JSValue, int)> onClick,
    const std::function<void(React::JSValue)> onCancel) noexcept {
  m_context.UIDispatcher().Post(
      [weakThis = weak_from_this(), target, placement, items = items.Copy(), onClick, onCancel] {
        if (auto strongThis = weakThis.lock()) {
          strongThis->ShowMenuFromUIDispatcher(target, placement, items, onClick, onCancel);
        }
      });
}

void ContextMenuNativeModule::hideMenu() noexcept {
  m_context.UIDispatcher().Post([weakThis = weak_from_this()] {
    if (auto strongThis = weakThis.lock()) {
      strongThis->HideMenuFromUIDispatcher();
    }
  });
}

void ContextMenuNativeModule::HideMenuFromUIDispatcher() noexcept {
  if (m_menu && m_menu.IsOpen()) {
    m_menu.Hide();
    m_menu = nullptr;
  }
}

void ContextMenuNativeModule::ShowMenuFromUIDispatcher(
    const int target,
    const std::string& placement,
    const React::JSValueArray& items,
    const std::function<void(React::JSValue, int)> onClick,
    const std::function<void(React::JSValue)> onCancel) noexcept {
  // It's safe to always call this since it's a no-op if menu isn't open.
  HideMenuFromUIDispatcher();

  m_menu = winrt::MenuFlyout();
  if (auto xamlRoot = React::XamlUIService::GetXamlRoot(m_context.Properties().Handle())) {
    m_menu.XamlRoot(xamlRoot);
  }
  auto closedRevoker = m_menu.Closed([=](auto&&, auto&&) {
    if (onCancel) {
      onCancel(nullptr);
    }
  });

  for (int i = 0; i < items.size(); i++) {
    AddMenuItem(m_menu, m_menu.Items(), closedRevoker, items[i], onClick);
  }
  winrt::FrameworkElement targetElement = nullptr;
  if (target > 0) {
    auto xamlUIService = React::XamlUIService::FromContext(m_context.Handle());
    targetElement = xamlUIService.ElementFromReactTag(target).as<winrt::FrameworkElement>();
  }
  if (targetElement != nullptr) {
    m_menu.Placement(GetPlacement(placement));
    m_menu.ShowAt(targetElement);
  } else {
    m_menu.ShowAt(nullptr, GetPointerPosition());
  }
}

/*static*/ winrt::FlyoutPlacementMode ContextMenuNativeModule::GetPlacement(
    const std::string& placement) noexcept {
  auto iter = placementMap.find(placement);

  if (iter != placementMap.end()) {
    return iter->second;
  }

  // Default is Top per:
  // https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.controls.primitives.flyoutbase.placement
  return winrt::FlyoutPlacementMode::Top;
}

void ContextMenuNativeModule::AddMenuItem(
    const winrt::MenuFlyout& menu,
    const winrt::IVector<winrt::MenuFlyoutItemBase>& items,
    winrt::event_token const closedRevoker,
    const React::JSValue& item,
    const std::function<void(React::JSValue, int)> onClick) noexcept {
  auto menuItemTypePtr = item["type"].TryGetString();
  if (menuItemTypePtr && *menuItemTypePtr == "separator") {
    items.Append(winrt::MenuFlyoutSeparator());
    return;
  }

  auto isChecked = false;
  if (auto checkedPtr = item["checked"].TryGetBoolean()) {
    isChecked = *checkedPtr;
  }

  auto submenuPtr = item["submenu"].TryGetArray();

  // We have two different variables because most of the props aren't in a shared base class.
  winrt::MenuFlyoutItem menuItem = nullptr;
  winrt::MenuFlyoutSubItem menuSubItem = nullptr;
  if (submenuPtr) {
    menuSubItem = winrt::MenuFlyoutSubItem();
  } else {
    menuItem = isChecked ? winrt::ToggleMenuFlyoutItem() : winrt::MenuFlyoutItem();
  }

  if (isChecked && menuItem) {
    menuItem.as<winrt::ToggleMenuFlyoutItem>().IsChecked(true);
  }
  if (auto labelPtr = item["label"].TryGetString()) {
    auto text = winrt::to_hstring(*labelPtr);
    if (menuItem) {
      menuItem.Text(text);
    } else {
      menuSubItem.Text(text);
    }
  }
  if (auto disabledPtr = item["disabled"].TryGetBoolean()) {
    if (menuItem) {
      menuItem.IsEnabled(!*disabledPtr);
    }
  }
  if (menuItem) {
    int index = -1;
    if (auto indexPtr = item["index"].TryGetDouble()) {
      index = std::lround(*indexPtr);
    }
    menuItem.Click([=](auto const& /*sender*/, winrt::RoutedEventArgs const& /*args*/) {
      menu.Closed(closedRevoker);
      if (index >= 0) {
        onClick(nullptr, index);
      }
    });
  }
  auto iconPtr = item["icon"].TryGetObject();
  if (iconPtr != nullptr) {
    auto const& iconSource = *iconPtr;
    auto uriString = GetIconUri(iconSource);
    auto icon = winrt::BitmapIcon();

    // TODO: Remove this once Xaml Islands bug with dark mode icons is fixed.
    icon.ShowAsMonochrome(false);

    winrt::Uri uri{winrt::to_hstring(uriString)};
    icon.UriSource(uri);
    if (menuItem) {
      menuItem.Icon(icon);
    } else {
      menuSubItem.Icon(icon);
    }
  }

  if (menuSubItem) {
    for (int i = 0; i < submenuPtr->size(); i++) {
      AddMenuItem(m_menu, menuSubItem.Items(), closedRevoker, (*submenuPtr)[i], onClick);
    }
  }

  if (menuItem) {
    items.Append(menuItem);
  } else {
    items.Append(menuSubItem);
  }
}

/*static*/ winrt::Point ContextMenuNativeModule::GetPointerPosition() noexcept {
  auto window = winrt::CoreWindow::GetForCurrentThread();
  auto pointerPosition = window.PointerPosition();
  pointerPosition.X = pointerPosition.X - window.Bounds().X;
  pointerPosition.Y = pointerPosition.Y - window.Bounds().Y;
  return pointerPosition;
}

std::string ContextMenuNativeModule::GetIconUri(const React::JSValueObject& iconSource) noexcept {
  auto uri = *iconSource["uri"].TryGetString();
  auto packagerAsset = *iconSource["__packager_asset"].TryGetBoolean();
  auto bundleRootPath = winrt::to_string(m_context.BundleRootPath());

  if (packagerAsset && uri.find("file://") == 0) {
    uri.replace(0, 7, bundleRootPath);
  }

  return uri;
}