This is essentially a code generator CLI — you write a model definition file once, run a command, and it spits out ready-made UI files.

You have a `model.json` file where you define your entity. You run something like `node generate.js model.json` and it produces `output.html` — a complete Bootstrap form with all the right input types rendered.

switch - true | false

Good — this tells me a lot. Let me read what you've defined and flag a few things worth discussing before generating.

How to generate
```
node <generator-path> <model-instruction-path>
```

Example:
```
node src\generators\generate-stable.js src\generators\topic.json
```