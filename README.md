# MathCAPTCHA API v1.0.0
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Author](https://img.shields.io/badge/author-Jasonpw-blueviolet)
**MathCAPTCHA** is a modern, dynamic Anti-Bot verification system. Say goodbye
to boring "guess the bus" image captchas. MathCAPTCHA generates math logic
questions procedurally (in real-time) with auto-scaling, multilingual support,
and a professional JSON callback system.
**[Live Demo & Documentation](https://jproject-1.github.io/captcha-math/)**
## Features
- **Dynamic Math Logic**: Generates unique arithmetic, algebraic,
trigonometric, and calculus problems procedurally.
- **7 Difficulty Levels**: Ranging from basic arithmetic (Level 1) to
derivatives and integrals (Level 7), plus a `random` mode.
- **Vanilla JavaScript (ES6)**: Clean class-based implementation. Zero heavy
external dependencies (secure with Private Fields `#`).
- **10 UI Languages**: Support for ID, EN, ES, ZH, JA, RU, FR, AR, DE, HI.
Automatically adapts via `auto-web` or `auto-user`.
- **Dark/Light Mode**: Auto-adapts to user preference or can be forced via
configuration.
- **JSON Callbacks**: Easy integration with your backend for strict validation.
---
## Quick Start
### 1. HTML Requirement
MathCAPTCHA requires the HTML5 standard. Make sure the very first line of your
HTML file includes the doctype tag, otherwise the math features won't render
properly:
```html
<!DOCTYPE html>
<html lang="en">
```
### 2. Include the Container and Script
Place an empty container inside your form, include the API script, and
initialize the class.
```html
<!-- Add this where you want the widget to appear -->
<div id="my-captcha-box"></div>
<!-- Include the MathCAPTCHA API Script -->

<script src="https://jproject-1.github.io/captcha-math/api.js"></script>
<script>
const myCaptcha = new MathCAPTCHA({
containerId: 'my-captcha-box',
mode: 'auto', // Options: 'light', 'dark', 'auto'
language: 'id', // 10 Languages supported
level: 'random', // 1-7 or 'random'
maxAttempts: 5,
onSuccess: (response) => {
console.log("Success!", response);
// Important: Send 'response.data.token' to your backend for final
validation
},
onFail: (response) => {
console.log("Verification Failed:", response.reason);
},
onBlocked: (response) => {
console.log("User Blocked:", response);
}
});
</script>
```

---
## Configuration Parameters
| Parameter | Type | Default | Description |
|---------------|------------------|--------------|-------------|
| `containerId` | `String` | `null` | **(Required)** The ID of
the div to render the widget in. |
| `mode` | `String` | `'auto'` | Theme mode: `'light'`,
`'dark'`, `'auto'`. |
| `language` | `String` | `'auto-web'` | UI Language: `'id'`,
`'en'`, etc., or `'auto-user'`. |
| `level` | `Integer\|String`| `'random'` | Difficulty (1 - 7). Use
`'random'` for random selection. |
| `maxAttempts` | `Integer` | `5` | Max failed attempts before
temporary block. |
| `onSuccess` | `Function` | `void` | **(Required)** Callback
executed when user answers correctly. |
| `onFail` | `Function` | `void` | Callback executed upon
wrong answer or manual close. |
| `onBlocked` | `Function` | `void` | Callback executed when
`maxAttempts` is reached. |
---
## JSON Output Structure
Below is the explanation of the output received through callback functions when

users interact.
### `onSuccess` Output
```json
{
"status": "success",
"data": {
"levelPlayed": 4,
"attemptsUsed": 2,
"timestamp": "2026-08-24T12:00:00.000Z",
"token": "eyJ2YWxpZCI6..."
}
}
```
### `onFail` / `onBlocked` Output
```json
{
"status": "failed", // or "blocked"
"reason": "wrong_answer", // or "closed_by_user"
"attemptsUsed": 1,
"maxAttempts": 5,
"levelPlayed": 4,
"timestamp": "2026-08-24T12:00:00.000Z"
}
```

---
## License & Credits
- **Author:** [Jasonpw](https://jasonpw.web.id/)
- **Managed by:** [YCYL STUDIO](https://ycylstudio.web.id/)
Open Source under the MIT License. Copyright © 2026.
