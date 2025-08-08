const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// HTTP endpoint to log rainfall readings
exports.logRainfall = functions.https.onRequest(async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (isNaN(amount)) {
      res.status(400).json({ error: 'amount required' });
      return;
    }
    const entry = { timestamp: Date.now(), amount };
    await admin.database().ref('rainfall/logs').push(entry);
    res.json({ status: 'logged', entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Scheduled function to aggregate daily rainfall totals
exports.aggregateDailyRainfall = functions.pubsub.schedule('0 0 * * *').onRun(async () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const logsRef = admin.database().ref('rainfall/logs');
  const snapshot = await logsRef
    .orderByChild('timestamp')
    .startAt(start.getTime())
    .endAt(end.getTime() - 1)
    .once('value');

  let total = 0;
  snapshot.forEach(child => {
    const val = child.val();
    total += Number(val.amount) || 0;
  });

  const dateKey = start.toISOString().split('T')[0];
  await admin.database().ref(`rainfall/dailyTotals/${dateKey}`).set(total);

  const limit = Number(process.env.RAINFALL_LIMIT || 100);
  if (total > limit) {
    await admin.messaging().send({
      topic: 'rainfallAlerts',
      notification: {
        title: 'Heavy Rainfall',
        body: `Rainfall reached ${total}mm on ${dateKey}`,
      },
    });
  }
});
