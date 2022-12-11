const fs = require('fs');
// split by empty line
const input = fs.readFileSync('input.txt').toString().split('\r\n\r\n');

const monkeys = input.map((item, index) => {
	const lines = item.split('\r\n');
	const name = lines[0].replace(':', '');
	const items = lines[1]
		.replace('Starting items: ', '')
		.split(',')
		.map((item) => parseInt(item.trim()));
	const operation = (oldValue) => {
		let operation = lines[2]
			.replace('Operation: new = ', '')
			.trim()
			.split(' ');
		let newValue = 0;
		if (operation[0] === 'old') newValue = oldValue;
		if (!isNaN(operation[0])) newValue = parseInt(operation[0]);

		let value = isNaN(operation[2]) ? oldValue : parseInt(operation[2]);
		if (operation[1] === '+') newValue += value;
		if (operation[1] === '*') newValue *= value;

		// divide the result by 3 and round down to the nearest integer
		// newValue = Math.floor(newValue / 3);
		return newValue;
	};
	const test = (worryLevel) => {
		const value = parseInt(
			lines[3].replace('Test: divisible by ', '').trim()
		);
		const leftOver = worryLevel % value;
		worryLevel = leftOver;
		return leftOver;
	};
	const ifTrueMonkeyId = parseInt(
		lines[4].replace('If true: throw to monkey ', '').trim()
	);
	const ifFalseMonkeyId = parseInt(
		lines[5].replace('If false: throw to monkey ', '').trim()
	);

	return {
		index,
		name,
		items,
		inspect: operation,
		test,
		ifTrueMonkeyId,
		ifFalseMonkeyId,
		inspections: 0,
	};
});

const HCM = 13 * 7 * 19 * 5 * 3 * 11 * 17 * 2;
for (let i = 0; i < 10000; i++) {
	monkeys.forEach((monkey) => {
		let items = [...monkey.items];
		items.forEach((item) => {
			monkey.inspections++;
			const indexOfItem = monkey.items.indexOf(item);
			let newValue = monkey.inspect(item);

			const testValue = monkey.test(newValue);
			if (newValue > HCM) newValue = newValue % HCM;

			let monkeyIndex =
				testValue === 0 ? monkey.ifTrueMonkeyId : monkey.ifFalseMonkeyId;

			monkeys[monkeyIndex].items.push(newValue);
			monkey.items.splice(indexOfItem, 1);

			const actionString = `Item ${item} => ${newValue}, thrown to ${monkeyIndex}, this monkey has ${monkey.items.length} items, the other monkey has ${monkeys[monkeyIndex].items.length} items`;

			// console.log(actionString);
		});
	});
}

console.table(
	monkeys.map((monkey) => ({
		name: monkey.name,
		inspections: monkey.inspections,
		itemsLength: monkey.items.length,
	}))
);

const { highest, secondHighest } = monkeys.reduce(
	(acc, monkey) => {
		if (monkey.inspections > acc.highest) {
			acc.secondHighest = acc.highest;
			acc.highest = monkey.inspections;
		} else if (monkey.inspections > acc.secondHighest) {
			acc.secondHighest = monkey.inspections;
		}
		return acc;
	},
	{ highest: 0, secondHighest: 0 }
);

const levelOfMonkeyBusiness = highest * secondHighest;
console.log(
	`Level of monkey business: ${highest} * ${secondHighest} = ${levelOfMonkeyBusiness}`
);
