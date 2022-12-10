const fs = require('fs');
const input = fs.readFileSync('input.txt').toString().split('\r\n');

let output = input.map((item, index) => {
	let parts = item.split(' ');
	let direction = parts[0];
	if (direction === 'R') direction = 'Right';
	if (direction === 'L') direction = 'Left';
	if (direction === 'U') direction = 'Up';
	if (direction === 'D') direction = 'Down';
	return { direction, distance: parseInt(parts[1]) };
});

let headPositionP1 = { x: 0, y: 0 };
let tailPositionsP1 = [{ x: 0, y: 0 }];
let visitedCoordinatesP1 = [{ x: 0, y: 0 }];

let headPositionP2 = { x: 0, y: 0 };
let tailPositionsP2 = [
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
];
let visitedCoordinatesP2 = [{ x: 0, y: 0 }];

const isTailFarFromHead = (headPosition, tailPosition) => {
	let distanceX = Math.abs(headPosition.x - tailPosition.x);
	let distanceY = Math.abs(headPosition.y - tailPosition.y);
	if (distanceX > 1 || distanceY > 1) return true;
	return false;
};

const moveTail = (hPosition, tPosition) => {
	if (hPosition.x > tPosition.x) tPosition.x++;
	if (hPosition.x < tPosition.x) tPosition.x--;
	if (hPosition.y > tPosition.y) tPosition.y++;
	if (hPosition.y < tPosition.y) tPosition.y--;
};

const instructionsToMovement = (
	instructions,
	visitedCoordinates,
	headPosition,
	tailPositions
) => {
	instructions.forEach((item) => {
		let { direction, distance } = item;
		for (let steps = 0; steps < distance; steps++) {
			if (direction === 'Right') headPosition.x++;
			if (direction === 'Left') headPosition.x--;
			if (direction === 'Up') headPosition.y++;
			if (direction === 'Down') headPosition.y--;

			tailPositions.forEach((tail, index) => {
				let head = index === 0 ? headPosition : tailPositions[index - 1];
				if (isTailFarFromHead(head, tail)) {
					moveTail(head, tail);
					if (index === 8 || tailPositions.length === 1) {
						visitedCoordinates.push({
							x: tail.x,
							y: tail.y,
						});
					}
				}
			});
		}
	});
	return visitedCoordinates;
};

const removeDuplicateObjectsFromArray = (array) => {
	return array.filter((item, index) => {
		return (
			array.findIndex(
				(item2) => item2.x === item.x && item2.y === item.y
			) === index
		);
	});
};

const compileMapFromVisitedCoordinates = (visitedCoordinates) => {
	let maxX = Math.max(...visitedCoordinates.map((item) => item.x));
	let maxY = Math.max(...visitedCoordinates.map((item) => item.y));
	if (maxX < 0 || maxY < 0) return [];

	let map = [...Array(maxX + 1).keys()].map(() => Array(maxY + 1).fill(false));

	visitedCoordinates.forEach((item) => {
		if (!map[item.y]) map[item.y] = [];
		map[item.y][item.x] = true;
	});

	return map;
};

const printWalkingMap = (map) => {
	let count = 0;
	map.reverse();
	map.forEach((row) => {
		let line = '';
		row.forEach((item) => {
			if (item) {
				count++;
				line += '#';
			} else line += '.';
		});
		console.log(line);
	});
	map.reverse();
};

visitedCoordinatesP1 = instructionsToMovement(
	output,
	visitedCoordinatesP1,
	headPositionP1,
	tailPositionsP1
);
visitedCoordinatesP1 = removeDuplicateObjectsFromArray(visitedCoordinatesP1);

// printWalkingMap(compileMapFromVisitedCoordinates(visitedCoordinatesP1));

console.log();
console.log(`PART 1`);
console.log(`Tail visited positions: ${visitedCoordinatesP1.length}`);
console.log();

visitedCoordinatesP2 = instructionsToMovement(
	output,
	visitedCoordinatesP2,
	headPositionP2,
	tailPositionsP2
);
visitedCoordinatesP2 = removeDuplicateObjectsFromArray(visitedCoordinatesP2);

console.log();
console.log(`PART 2`);
console.log(`Tail visited positions: ${visitedCoordinatesP2.length}`);
console.log();
