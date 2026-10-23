<div align="center">

<h1>cal-tag-app</h1>

<p><b>Calendar events that ring, tagged by hand.</b></p>

<p><i>Type <code>alarm5</code> in a meeting's description and get an alarm five minutes before it. An early experiment, left unfinished.</i></p>

<h6>

![Expo 51](https://img.shields.io/badge/Expo-51-111111?style=flat-square&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.75-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![API](https://img.shields.io/badge/API-Google%20Calendar-4285F4?style=flat-square)
![Status](https://img.shields.io/badge/status-abandoned%20(Oct%202024)-555555?style=flat-square)

</h6>

<a href="#what-works"><b>What works</b></a> ·
<a href="#what-does-not"><b>What does not</b></a> ·
<a href="#run-it"><b>Run it</b></a>

</div>

<br>

An Expo app that signs in with Google, reads the next seven days of your primary calendar, and
looks for tags like `alarm3` or `alarm10` in each event's description. Each tag becomes a live
countdown to "N minutes before the meeting", with the plan of firing a real alarm sound at that
moment. It got as far as showing events and countdowns on the web build; the alarm part never
worked. The same idea was later rebuilt from scratch, on iOS AlarmKit, as
[CALarm](https://github.com/parthchandak02/calarm).

## What works

- **Google sign-in.** `expo-auth-session` with the read-only Calendar scope.
- **Upcoming events.** The Calendar API's `events.list` on `primary`, next 7 days, paged 10 at a
  time, grouped under day headings and pull-to-refresh.
- **Alarm tags.** `alarmN` in the description is parsed into one countdown per tag
  (`Alarm 5 min before: 0d 00:04:59`) on each event card; tap a card to see the description.
- **Theming.** Montserrat, light and dark colour schemes, React Native Paper components.

## What does not

- **Notifications.** The last commit wires in OneSignal push and an `alarm.mp3` sound, and is
  marked "not working, checkpoint only". Scheduling also looks for `alarm3` and `alarm5` as
  fields on the event object rather than in its description, so no alarm is ever queued.
- **iOS sign-in.** A run of commits tries to fix native Google sign-in on device; it was not
  verified.
- **Settings tab.** Empty placeholder.

## Run it

Needs your own Google OAuth client IDs and a OneSignal app ID in a `.env` file
(`WEB_CLIENT_ID`, `IOS_CLIENT_ID`, `ONESIGNAL_APP_ID`, read through `react-native-dotenv`).

```bash
git clone https://github.com/parthchandak02/cal-tag-app.git
cd cal-tag-app
npm install
npm run web             # the build that got furthest
npx expo run:ios        # native build with the dev client
```

<details>
<summary><b>Project layout</b></summary>

```
app/(tabs)/events.tsx        Sign-in, event list, tag parsing, snooze handling
app/utils/googleCalendar.ts  OAuth request and Calendar API paging
app/utils/Notification*.ts   OneSignal and expo-notifications attempts
app/components/              EventCard, CountdownTimer, themed views
assets/alarms/alarm.mp3      The alarm sound bundled for notifications
scripts/create-icons.js      Generates app icon sizes from one image
```

</details>

<br>

<div align="center">
<sub>Built with Expo Router, React Native Paper and the Google Calendar API.</sub>
</div>
