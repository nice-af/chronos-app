#pragma once

#include <NativeModules.h>

#include <mutex>

#include <winrt/Windows.UI.Core.h>
#include <winrt/Windows.UI.Xaml.Controls.Primitives.h>
#include <winrt/Windows.UI.Xaml.Controls.h>

REACT_MODULE(ContextMenuNativeModule)
struct ContextMenuNativeModule : public std::enable_shared_from_this<ContextMenuNativeModule> {
  REACT_INIT(initialize)
  void initialize(winrt::Microsoft::ReactNative::ReactContext const& reactContext) noexcept;

  REACT_METHOD(showMenu);
  void showMenu(const int target,
                const std::string placement,
                const winrt::Microsoft::ReactNative::JSValueArray items,
                const std::function<void(winrt::Microsoft::ReactNative::JSValue, int)> onClick,
                const std::function<void(React::JSValue)> onCancel) noexcept;

  REACT_METHOD(hideMenu);
  void hideMenu() noexcept;

 private:
  void ShowMenuFromUIDispatcher(const int target,
                                const std::string& placement,
                                const React::JSValueArray& items,
                                const std::function<void(React::JSValue, int)> onClick,
                                const std::function<void(React::JSValue)> onCancel) noexcept;
  void HideMenuFromUIDispatcher() noexcept;
  void AddMenuItem(const winrt::Windows::UI::Xaml::Controls::MenuFlyout& menu,
                   const winrt::Windows::Foundation::Collections::IVector<
                       winrt::Windows::UI::Xaml::Controls::MenuFlyoutItemBase>& items,
                   winrt::event_token const closedRevoker,
                   const React::JSValue& item,
                   const std::function<void(React::JSValue, int)> onClick) noexcept;
  static winrt::Windows::UI::Xaml::Controls::Primitives::FlyoutPlacementMode GetPlacement(
      const std::string& placement) noexcept;
  static winrt::Windows::Foundation::Point GetPointerPosition() noexcept;
  std::string GetIconUri(const winrt::Microsoft::ReactNative::JSValueObject& iconSource);

  React::ReactContext m_context;
  winrt::Windows::UI::Xaml::Controls::MenuFlyout m_menu = nullptr;
};
