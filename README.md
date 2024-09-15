## A simple, object-oriented event implementation for Node and browser.

Fully typed for beautiful TS development.

### API Examples

Create your event:
```ts
import { Event } from '@jtjs/event';

type ThemeChangeHandler = (themeName: string) => void;

const onThemeChange = new Event<ThemeChangeHandler>();
```

Subscribe to your event:
```ts
onThemeChange.subscribe((themeName) => {
  console.log(`Theme changed to ${themeName}!`);
});
```

Subscribe to your event for one trigger:
```ts
onThemeChange.once((themeName) => {
  console.log('Just once!');
});
```

Unsubscribe from your event (method 1):
```ts
const unsub = onThemeChange.subscribe((themeName) => {
  console.log('beep boop');
});

unsub();
```

Unsubscribe from your event (method 2):
```ts
const handler = (themeName: string) => {
  console.log('beep boop');
};

onThemeChange.subscribe(handler);

onThemeChange.unsubscribe(handler);
```

Trigger your event:
```ts
onThemeChange.trigger('light');
```
