const fs = require('fs');
const input = fs.readFileSync('input.txt').toString().split('\r\n');
let output = {};

output = input.map((item, index) => {
	let line = [];
	// foreach lower case letter in item convert that letter to numeric value, a -> 1, b -> 2, c -> 3, etc.
	// then add that value to the line
	for (let i = 0; i < item.length; i++) {
		if (item[i] >= 'a' && item[i] <= 'z') {
			line.push({ height: item[i].charCodeAt(0) - 96, visited: false });
		} else {
			line.push({ height: item[i], visited: true });
		}
	}
	return line;
});
// realize a pathfinding algorithm to find the shortest path from the start marked S to the end marked E
// the shortest path is the path with the least number of steps
// the path can only move in the four cardinal directions (up, down, left, right)
// the path cannot move diagonally
// the path cannot move if the next step is a value that differs by more than 1 from the current step

const dijkstra = (graph, start, end) => {
	let distances = {};
	let previous = {};
	let nodes = new Set(Object.keys(graph));
	let smallest;

	for (let node in graph) {
		if (node === start) {
			distances[node] = 0;
		} else {
			distances[node] = Infinity;
		}
		previous[node] = null;
	}

	while (nodes.size > 0) {
		smallest = findLowestDistanceNode(distances, nodes);
		if (smallest === null) return { distances, previous };
		if (smallest === end) {
			return { distances, previous };
		}
		nodes.delete(smallest);
		for (let neighbor in graph[smallest]) {
			let alt = distances[smallest] + graph[smallest][neighbor];
			if (alt < distances[neighbor]) {
				distances[neighbor] = alt;
				previous[neighbor] = smallest;
			}
		}
	}
	return { distances, previous };
};

const findLowestDistanceNode = (distances, nodes) => {
	let lowest = Infinity;
	let lowestNode = null;
	for (let node in distances) {
		let distance = distances[node];

		if (distance < lowest && nodes.has(node)) {
			lowest = distance;
			lowestNode = node;
		}
	}
	return lowestNode;
};

const findShortestPath = (previous, end) => {
	let nodes = [];
	let u = end;
	while (previous[u]) {
		nodes.push(u);
		u = previous[u];
	}
	nodes.push(u);
	return nodes.reverse();
};

const start = {};
const end = {};
let shortestPath = 0;
const graph = {};
const isWalkable = (height1, height2) => {
	let one = height1;
	let two = height2;
	if (height1 === 'S') one = 1;
	if (height1 === Infinity) one = 1;
	if (height1 === 'E') one = 26;
	if (height2 === 'S') two = 1;
	if (height2 === Infinity) two = 1;
	if (height2 === 'E') two = 26;
	return one - two <= 1;
};

let iterations = 0;
let shortestPaths = [];
const amountOfAs = output.reduce((acc, item) => {
	return acc + item.filter((item) => item.height === 1).length;
}, 0);
console.log('🚀 ~ file: index.js:101 ~ amountOfAs ~ amountOfAs', amountOfAs);

for (let i = 0; i < amountOfAs; i++) {
	console.log(`Iteration: ${iterations++}`);
	start.x = undefined;
	start.y = undefined;
	for (let y = 0; y < output.length; y++) {
		for (let x = 0; x < output[y].length; x++) {
			if (
				output[y][x].height === 1 &&
				start.x === undefined &&
				start.y === undefined
			) {
				start.x = x;
				start.y = y;
				output[y][x].height = Infinity;
			}
			if (output[y][x].height === 'E') {
				end.x = x;
				end.y = y;
			}
			if (output[y][x].height !== ' ') {
				graph[`${x},${y}`] = {};
				if (
					output[y][x - 1] &&
					isWalkable(output[y][x - 1].height, output[y][x].height)
				) {
					graph[`${x},${y}`][`${x - 1},${y}`] = 1;
				}
				if (
					output[y][x + 1] &&
					isWalkable(output[y][x + 1].height, output[y][x].height)
				) {
					graph[`${x},${y}`][`${x + 1},${y}`] = 1;
				}
				if (
					output[y - 1] &&
					isWalkable(output[y - 1][x].height, output[y][x].height)
				) {
					graph[`${x},${y}`][`${x},${y - 1}`] = 1;
				}
				if (
					output[y + 1] &&
					isWalkable(output[y + 1][x].height, output[y][x].height)
				) {
					graph[`${x},${y}`][`${x},${y + 1}`] = 1;
				}
				// if nothing got addded to the graph, delete the node
				if (Object.keys(graph[`${x},${y}`]).length === 0) {
					delete graph[`${x},${y}`];
				}
			}
		}
	}
	console.log(`${start.x},${start.y}`);
	if (start.x === undefined || start.y === undefined) continue;
	const { distances, previous } = dijkstra(
		graph,
		`${start.x},${start.y}`,
		`${end.x},${end.y}`
	);
	console.log('finished dijkstra');
	const path = findShortestPath(previous, `${end.x},${end.y}`);
	console.log('finished pathfinding');
	// draw map with path
	let newMap = [...output];
	newMap = newMap.map((row) => {
		return row.map((cell) => {
			if (cell.height === Infinity) return 'S';
			return '.';
		});
	});

	for (let i = 0; i < path.length; i++) {
		const [x, y] = path[i].split(',');
		newMap[y][x] = 'X';
	}
	console.clear();
	const drawnMap = newMap
		.map((row) => {
			return row.join('');
		})
		.join('\n');
	console.log(drawnMap);

	shortestPath = path.length - 1;
	shortestPaths.push({
		shortestPath,
		start: `${start.x},${start.y}`,
		map: drawnMap,
	});
	console.log(shortestPath);
}

// remove 0 values
shortestPaths = shortestPaths.filter((path) => path.shortestPath !== 0);
shortestPaths.sort((a, b) => a.shortestPath - b.shortestPath);

console.log(shortestPaths[0].map);
console.log(shortestPaths[0].shortestPath);
console.log(shortestPaths[0].start);
