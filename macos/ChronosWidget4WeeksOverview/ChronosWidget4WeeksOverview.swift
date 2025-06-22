//
//  ChronosWidget4WeeksOverview.swift
//  ChronosWidget4WeeksOverview
//
//  Created by Adrian on 22.06.25.
//

import SwiftUI
import WidgetKit

//
// Types from React Native
//

struct FourWeeksWorklogDayOverview {
  let date: String  // ISO date string (YYYY-MM-DD)
  let trackedHours: Double
  let workingHours: Double
  let enabled: Bool
}

struct FourWeeksWorklogOverview {
  let days: [FourWeeksWorklogDayOverview]  // Ordered oldest to newest (28 days)
}

struct WorklogEntry: TimelineEntry {
  let date: Date
  let worklogData: FourWeeksWorklogOverview
}

struct WorklogProvider: TimelineProvider {

  // Returns a placeholder entry for widget previews
  func placeholder(in context: Context) -> WorklogEntry {
    WorklogEntry(date: Date(), worklogData: generatePlaceholderData())
  }

  // Returns a snapshot entry for the widget gallery
  func getSnapshot(in context: Context, completion: @escaping (WorklogEntry) -> Void) {
    let entry = WorklogEntry(date: Date(), worklogData: generatePlaceholderData())
    completion(entry)
  }

  // Returns the timeline for the widget
  func getTimeline(in context: Context, completion: @escaping (Timeline<WorklogEntry>) -> Void) {
    let entry = WorklogEntry(date: Date(), worklogData: generatePlaceholderData())
    let timeline = Timeline(entries: [entry], policy: .never)
    completion(timeline)
  }

  // Generates 4 weeks of random placeholder data for previews and gallery
  func generatePlaceholderData() -> FourWeeksWorklogOverview {
    let calendar = Calendar.current
    let today = Date()
    var days: [FourWeeksWorklogDayOverview] = []

    for i in 0..<28 {
      let date = calendar.date(byAdding: .day, value: -(27 - i), to: today)!
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "yyyy-MM-dd"
      let dateString = dateFormatter.string(from: date)

      // Generate some realistic placeholder data
      let trackedHours = Double.random(in: 0...10)
      let workingHours = 8.0
      let weekday = calendar.component(.weekday, from: date)
      let enabled = !(weekday == 1 || weekday == 7)  // Sunday = 1, Saturday = 7

      days.append(
        FourWeeksWorklogDayOverview(
          date: dateString,
          trackedHours: trackedHours,
          workingHours: workingHours,
          enabled: enabled
        ))
    }

    return FourWeeksWorklogOverview(days: days)
  }
}

// The main view for the widget, showing the activity grid
struct ChronosWidget4WeeksOverviewEntryView: View {
  var entry: WorklogEntry
  @Environment(\.widgetFamily) var family

  private var dayLabels: [String] {
    [
      NSLocalizedString("day_mo", comment: "Monday short label"),
      NSLocalizedString("day_tu", comment: "Tuesday short label"),
      NSLocalizedString("day_we", comment: "Wednesday short label"),
      NSLocalizedString("day_th", comment: "Thursday short label"),
      NSLocalizedString("day_fr", comment: "Friday short label"),
      NSLocalizedString("day_sa", comment: "Saturday short label"),
      NSLocalizedString("day_su", comment: "Sunday short label"),
    ]
  }

  private var trackedTimesTitle: String {
    NSLocalizedString("tracked_times", comment: "Title for tracked times section")
  }

  private var cellSize: CGSize {
    switch family {
    case .systemMedium:
      return CGSize(width: 32, height: 16)
    default:
      return CGSize(width: 16, height: 16)
    }
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      // Title
      Text(trackedTimesTitle)
        .font(.headline)
        .fontWeight(.semibold)
        .foregroundColor(.primary)

      VStack(spacing: 4) {
        // Day labels
        HStack(spacing: 2) {
          ForEach(dayLabels, id: \.self) { label in
            Text(label)
              .font(.caption2)
              .foregroundColor(.secondary)
              .frame(width: cellSize.width, height: 12)
          }
        }

        // Activity grid (4 weeks x 7 days)
        VStack(spacing: 6) {
          ForEach(0..<4, id: \.self) { week in
            HStack(spacing: 6) {
              ForEach(0..<7, id: \.self) { day in
                let dayIndex = week * 7 + day
                if dayIndex < entry.worklogData.days.count {
                  let dayData = entry.worklogData.days[dayIndex]
                  Rectangle()
                    .fill(colorForTrackedHours(dayData.trackedHours, enabled: dayData.enabled))
                    .frame(width: cellSize.width, height: cellSize.height)
                    .cornerRadius(4)
                } else {
                  Rectangle()
                    .fill(Color.gray.opacity(0.1))
                    .frame(width: cellSize.width, height: cellSize.height)
                    .cornerRadius(4)
                }
              }
            }
          }
        }
      }
    }
    .padding(.horizontal, 4)
    .padding(.vertical, 4)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .containerBackground(.background, for: .widget)
  }

  private func colorForTrackedHours(_ hours: Double, enabled: Bool) -> Color {
    if !enabled {
      return Color.gray.opacity(0.1)
    }

    switch hours {
    case 0:
      return Color.gray.opacity(0.2)
    case 0..<2:
      return Color.blue.opacity(0.3)
    case 2..<4:
      return Color.blue.opacity(0.5)
    case 4..<6:
      return Color.blue.opacity(0.7)
    case 6..<8:
      return Color.blue.opacity(0.9)
    default:
      return Color.blue
    }
  }
}

// Widget configuration and registration
struct ChronosWidget4WeeksOverview: Widget {
  let kind: String = "ChronosWidget4WeeksOverview"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WorklogProvider()) { entry in
      ChronosWidget4WeeksOverviewEntryView(entry: entry)
    }
    .configurationDisplayName(
      NSLocalizedString("widget_display_name", comment: "Widget display name")
    )
    .description(NSLocalizedString("widget_description", comment: "Widget description"))
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
