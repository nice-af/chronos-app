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

struct FourWeeksWorklogDayOverview: Codable {
  let date: String  // ISO date string (YYYY-MM-DD)
  let trackedHours: Double
  let workingHours: Double
  let enabled: Bool
}

struct FourWeeksWorklogOverview: Codable {
  let days: [FourWeeksWorklogDayOverview]  // Ordered oldest to newest (28 days)
}

struct WorklogEntry: TimelineEntry {
  let date: Date
  let worklogData: FourWeeksWorklogOverview
}

struct WorklogProvider: TimelineProvider {
  // Helper to load real data from app group
  func loadWorklogOverviewFromAppGroup() -> FourWeeksWorklogOverview? {
    let appGroup = "group.adrianfahrbach.chronos"
    if let userDefaults = UserDefaults(suiteName: appGroup),
      let jsonString = userDefaults.string(forKey: "FourWeeksWorklogOverview"),
      let jsonData = jsonString.data(using: .utf8)
    {
      let decoder = JSONDecoder()
      do {
        let overview = try decoder.decode(FourWeeksWorklogOverview.self, from: jsonData)
        return overview
      } catch {
        print("Failed to decode FourWeeksWorklogOverview: \(error)")
        return nil
      }
    }
    return nil
  }

  // Returns a placeholder entry for widget previews
  func placeholder(in context: Context) -> WorklogEntry {
    WorklogEntry(date: Date(), worklogData: generatePlaceholderData())
  }

  // Returns a snapshot entry for the widget gallery
  func getSnapshot(in context: Context, completion: @escaping (WorklogEntry) -> Void) {
    let overview = loadWorklogOverviewFromAppGroup() ?? generatePlaceholderData()
    let entry = WorklogEntry(date: Date(), worklogData: overview)
    completion(entry)
  }

  // Returns the timeline for the widget
  func getTimeline(in context: Context, completion: @escaping (Timeline<WorklogEntry>) -> Void) {
    let overview = loadWorklogOverviewFromAppGroup() ?? generatePlaceholderData()
    let entry = WorklogEntry(date: Date(), worklogData: overview)
    let timeline = Timeline(entries: [entry], policy: .never)
    completion(timeline)
  }

  // Generates 4 weeks of random placeholder data for previews and gallery
  func generatePlaceholderData() -> FourWeeksWorklogOverview {
    let calendar = Calendar.current
    let today = Date()
    // Find the most recent Monday (weekday = 2)
    let weekdayToday = calendar.component(.weekday, from: today)
    let daysSinceMonday = (weekdayToday + 5) % 7  // 0 if Monday, 6 if Sunday
    let startDate = calendar.date(byAdding: .day, value: -daysSinceMonday - 27, to: today)!
    var days: [FourWeeksWorklogDayOverview] = []

    for i in 0..<28 {
      let date = calendar.date(byAdding: .day, value: i, to: startDate)!
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "yyyy-MM-dd"
      let dateString = dateFormatter.string(from: date)

      let trackedHours: Double
      if Double.random(in: 0...1) < 0.5 {
        trackedHours = 8.0
      } else {
        trackedHours = Double.random(in: 0...12)
      }
      let workingHours = 8.0
      let weekday = calendar.component(.weekday, from: date)
      let enabled = !(weekday == 1 || weekday == 2)

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
    return CGSize(width: 16, height: 16)
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      // Title
      Text(trackedTimesTitle)
        .font(.headline)
        .fontWeight(.semibold)
        .foregroundColor(.primary)

      Spacer()

      VStack(spacing: 6) {
        // Day labels
        HStack(spacing: 3) {
          ForEach(dayLabels, id: \.self) { label in
            Text(label)
              .font(.caption2)
              .foregroundColor(.secondary.opacity(0.8))
              .frame(width: cellSize.width, height: 12, alignment: .center)
          }
        }

        // Activity grid (4 weeks x 7 days)
        VStack(spacing: 5) {
          ForEach(0..<4, id: \.self) { week in
            HStack(spacing: 3) {
              ForEach(0..<7, id: \.self) { day in
                let dayIndex = week * 7 + day
                if dayIndex < entry.worklogData.days.count {
                  let dayData = entry.worklogData.days[dayIndex]
                  let ratio =
                    dayData.workingHours > 0 ? dayData.trackedHours / dayData.workingHours : 0
                  let (fillColor, overlayOpacity) = colorForTrackedRatio(
                    ratio, tracked: dayData.trackedHours, working: dayData.workingHours,
                    enabled: dayData.enabled)
                  Rectangle()
                    .fill(fillColor)
                    .frame(width: cellSize.width, height: cellSize.height)
                    .cornerRadius(4)
                    .overlay(
                      dayData.enabled && dayData.trackedHours > 0 && overlayOpacity > 0
                        ? RoundedRectangle(cornerRadius: 4)
                          .stroke(Color.white.opacity(overlayOpacity), lineWidth: 1)
                        : nil
                    )
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
    .padding(.vertical, 1)
    .padding(.horizontal, 16)
    .containerBackground(.background, for: .widget)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func colorForTrackedRatio(
    _ ratio: Double, tracked: Double, working: Double, enabled: Bool
  ) -> (Color, Double) {
    if !enabled || working == 0 {
      return (Color.gray.opacity(0.2), 0.0)
    }
    if ratio > 1.0 {
      return (Color.cyan, 0.25)
    }
    switch ratio {
    case 0:
      return (Color.gray.opacity(0.2), 0)
    case 0..<0.25:
      return (Color.blue.opacity(0.3), 0.04)
    case 0.25..<0.5:
      return (Color.blue.opacity(0.5), 0.08)
    case 0.5..<0.75:
      return (Color.blue.opacity(0.7), 0.1)
    case 0.75..<1.0:
      return (Color.blue.opacity(0.9), 0.12)
    case 1.0:
      return (Color.blue, 0.22)
    default:
      return (Color.gray.opacity(0.2), 0)
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
    .supportedFamilies([.systemSmall])  // Only support small widget
  }
}
