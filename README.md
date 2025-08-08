# arg-firebasewebsite

kkn desa kamulyan

## Rainfall logging

Cloud Functions are provided to log rainfall measurements and aggregate daily totals.

- `logRainfall` HTTP endpoint pushes `{timestamp, amount}` entries to `rainfall/logs`.
- `aggregateDailyRainfall` scheduled job sums the day's logs into `rainfall/dailyTotals/`.
- When daily rain exceeds `RAINFALL_LIMIT` an FCM notification is sent to the `rainfallAlerts` topic.
