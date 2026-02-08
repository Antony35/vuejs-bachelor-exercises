# EX 03-methods-events

![Exercise Image](image-exo-03.png)

1. What's the difference between `@click="method"` and `@click="method()"`?
`@click="method"` passes the function reference and automatically receives the native Event object. `@click="method()"` executes the function immediately and does not pass the event unless `$event` is used.
2. When would you use event modifiers vs handling in the method?
Use modifiers (like .prevent, .stop) for DOM event details (preventing defaults, propagation) to keep your methods focused purely on data logic.
3. Why is `.prevent` useful for forms?
It prevents the browser's default behavior of reloading the page upon form submission, allowing Vue to handle the data submission instead.
4. How do you pass both a parameter AND the event object to a method?
You use the special `$event` variable: `@click="method(parameter, $event)"`.