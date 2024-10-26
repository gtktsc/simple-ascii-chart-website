
## Simple ASCII Chart Website

### Overview
The **Simple ASCII Chart** website is a versatile tool that allows users to generate and visualize customizable ASCII-based charts. It provides a few different ways to interact with the charting system: through a web-based UI, an interactive playground, or by hitting an API directly. The website is also integrated with a **CLI** to generate charts from your terminal.

### Accessing the Website

You can access the live website directly via:
```
https://simple-ascii-chart.vercel.app/
```

### API Usage

To generate charts via the API, send a GET request to the following endpoint with your `input` and optional `settings` query parameters:

Example API call:
```
https://simple-ascii-chart.vercel.app/api?input=[[1,2],[2,3],[3,4]]&settings={%22width%22:50}
```

### Playground

The website offers an interactive **Playground** that allows users to create charts by adjusting input data and configuration settings in real time. Visit the playground to experiment with different chart parameters:
```
https://simple-ascii-chart.vercel.app/playground
```

### CLI Usage

To generate ASCII charts from the command line, you can use the **Simple ASCII Chart CLI**. Install it globally with the following command:

```
npm install -g simple-ascii-chart-cli
```

Once installed, you can generate charts directly in your terminal by providing input data and chart settings. For example:

```
simple-ascii-chart "[[1, 2], [2, 4], [3, 8]]" --width 20 --height 10
```

This command will output the ASCII chart directly in your terminal.

### Library Usage

To use the **simple-ascii-chart** library in your project, install it via npm or yarn:

```
npm install simple-ascii-chart
```

or 

```
yarn add simple-ascii-chart
```

Once installed, you can use it in your code like this:

```javascript
import plot from 'simple-ascii-chart';

const input = [
  [1, 1],
  [2, 4],
  [3, 8],
  [4, 16],
];

const settings = { width: 20, height: 10 };
console.log(plot(input, settings));
```

### Features

- **Interactive Playground**: Modify chart inputs and settings dynamically.
- **API**: Generate ASCII charts via API requests.
- **CLI**: Generate ASCII charts from the command line.
- **Library**: Easily integrate ASCII charts into your codebase.

### Contributing

Feel free to contribute to the development of the **Simple ASCII Chart** website or its components. You can find the repository for the **CLI** and **Library** below:

- **CLI Repository**: [Simple ASCII Chart CLI](https://github.com/gtktsc/simple-ascii-chart-cli)
- **Library Repository**: [Simple ASCII Chart Library](https://github.com/gtktsc/ascii-chart)

### License

This project is open source and available under the MIT License.

