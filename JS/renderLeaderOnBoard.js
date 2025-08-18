const players = [
  { rank: 1, name: "Alice", score: 9800, avatar: "https://i.pravatar.cc/50?img=1" },
  { rank: 2, name: "Bob", score: 8700, avatar: "https://i.pravatar.cc/50?img=2" },
  { rank: 3, name: "Charlie", score: 7900, avatar: "https://i.pravatar.cc/50?img=3" },
  { rank: 4, name: "Diana", score: 7200, avatar: "https://i.pravatar.cc/50?img=4" },
  { rank: 5, name: "Eve", score: 6900, avatar: "https://i.pravatar.cc/50?img=5" }
];

const leaderboard = document.querySelector(".leader-board");
if (!leaderboard) {
  console.error("Leaderboard element not found");
}
leaderboard.innerHTML = ""; // Clear existing content

players.forEach(player => {
  const row = document.createElement("div");
  row.className = `player-row rank-${player.rank}`;

  row.innerHTML = `
    <div class="player-info">
      <span class="player-rank">${player.rank}</span>
      <img src="${player.avatar}" alt="${player.name}" class="player-avatar" />
      <span class="player-name">${player.name}</span>
    </div>
    <span class="player-score">${player.score}</span>
  `;

  leaderboard.appendChild(row);
});
