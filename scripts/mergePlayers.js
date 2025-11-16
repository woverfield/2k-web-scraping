/**
 * Merge current team players with classic/all-time players
 */

import fs from 'fs';

const currFile = 'nba2k-all-players.json';
const classAlltFile = 'nba2k-classic-alltime.json';
const outputFile = 'nba2k-all-players.json';

console.log('Loading current team players...');
const currData = JSON.parse(fs.readFileSync(currFile, 'utf-8'));
const currPlayers = currData.players || currData;

console.log('Loading classic/all-time players...');
const classAlltData = JSON.parse(fs.readFileSync(classAlltFile, 'utf-8'));
const classAlltPlayers = classAlltData.players || classAlltData;

console.log(`Current teams: ${currPlayers.filter(p => p.teamType === 'curr').length} players`);
console.log(`Classic/All-time (new): ${classAlltPlayers.length} players`);

// Filter out classic/all-time from current data and replace with new
const onlyCurr = currPlayers.filter(p => p.teamType === 'curr');
const merged = [...onlyCurr, ...classAlltPlayers];

console.log(`\nMerged total: ${merged.length} players`);
console.log(`  Current: ${merged.filter(p => p.teamType === 'curr').length}`);
console.log(`  Classic: ${merged.filter(p => p.teamType === 'class').length}`);
console.log(`  All-time: ${merged.filter(p => p.teamType === 'allt').length}`);

// Save merged data
fs.writeFileSync(outputFile, JSON.stringify({ players: merged }, null, 2));
console.log(`\nSaved to ${outputFile}`);
