let teams = [];

function addTeam() {
    const teamNameInput = document.getElementById('teamName');
    const teamName = teamNameInput.value.trim();

    if (teamName !=='') {
        teams.push(teamName);
        teamNameInput.value ='';
        renderTeamList();
        initializeTeamStatistics(teamName); 
    }
}

function renderTeamList() {
    const teamListDiv = document.getElementById('teamList');
    teamListDiv.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
        <th>NO.</th>
        <th>Team Name</th>
        <th>MP</th>
        <th>GF</th>
        <th>GA</th>
        <th>GD</th>
        <th>P</th>
        </tr>`;

    teams.forEach((team, index) => {
        const teamStats = getTeamStatistics(team);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team}</td>
            <td>${teamStats.matchesPlayed}</td>
            <td>${teamStats.goalsFor}</td>
            <td>${teamStats.goalsAgainst}</td>
            <td>${teamStats.goalsFor - teamStats.goalsAgainst}</td>
            <td>${teamStats.points}</td>
        `;
        table.appendChild(row);
    });

    teamListDiv.appendChild(table);
}

function saveTeamList() {
    localStorage.setItem('teamList', JSON.stringify(teams));
}

function retrieveTeamList() {
    const savedTeamList = localStorage.getItem('teamList');
    if (savedTeamList) {
        teams = JSON.parse(savedTeamList);
        renderTeamList();
    }
}

function initializeTeamStatistics(team) {
    const teamStats = {
        goalsFor: 0,
        goalsAgainst: 0,
        matchesPlayed: 0,
        points: 0
    };
    localStorage.setItem(team, JSON.stringify(teamStats));
}

function getTeamStatistics(team) {
    const teamStats = JSON.parse(localStorage.getItem(team));
    return teamStats || { goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0, points: 0 };
    
}

window.onload = retrieveTeamList;

function goToNextPage() {
    saveTeamList();
    const fixtureList = generateFixtureList();
    localStorage.setItem('fixtureList', JSON.stringify(fixtureList))
    window.location.href = 'simulator.html'
}
window.onload = retrieveTeamList

function generateFixtureList() {
    const numTeams = teams.length;
    const totalRounds = numTeams - 1;
    const fixtureList = [];
    const shuffledTeams = shuffleArray(teams.slice());

    for (let round = 0; round < totalRounds; round++) {
        const roundMatches = [];

        for (let i = 0; i < numTeams / 2; i++) {
            const homeIndex = Math.random() < 0.5 ? i : numTeams - 1 - i;
            const awayIndex = homeIndex === i ? numTeams - 1 - i : i;
            const homeTeam = shuffledTeams[homeIndex];
            const awayTeam = shuffledTeams[awayIndex]
            roundMatches.push(`${homeTeam} vs ${awayTeam}`);
            
        }
        
        fixtureList.push(roundMatches);

        const lastTeam = shuffledTeams.pop()
        shuffledTeams.splice(1, 0, lastTeam)
        
    }

    console.log(shuffledTeams);
    return fixtureList;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const roundNumber = 0;

const savedFixtureList = localStorage.getItem('fixtureList');
if (savedFixtureList) {
    const fixtureList = JSON.parse(savedFixtureList);
    renderFixtureList(fixtureList, roundNumber);
}

function renderFixtureList(fixtureList, roundNumber) {
    const fixtureListDiv = document.getElementById('fixtureList');
    fixtureListDiv.innerHTML = '<h2>Fixtures</h2>';
    
    const roundIndex = roundNumber + 1;
    const roundMatches = fixtureList[roundIndex];

    if (roundMatches) {
        const teamHeader = document.createElement('h3');
        teamHeader.textContent = `Round ${roundIndex}`;
        fixtureListDiv.appendChild(teamHeader);

        const matchList = document.createElement('ul');
        roundMatches.forEach(match => {
            const matchItem = document.createElement('li');
            matchItem.textContent = match;
            matchList.appendChild(matchItem);
        });
        fixtureListDiv.appendChild(matchList);
    } else {
        console.log("No matches found", fixtureList)
    };    
}

function extractFixtures() {
    const fixtureListDiv = document.getElementById("fixtureList");
    const rounds = fixtureListDiv.getElementsByTagName("h3");
    const fixtureList = [];

    for (let i = 0; i < rounds.length; i++) {
        const round = rounds[i];
        const matches = round.nextElementSibling.getElementsByTagName("li");
        const roundMatches = [];

        for (let j = 0; j < matches.length; j++) {
            roundMatches.push(matches[j].textContent);
        }

        fixtureList.push(roundMatches);
    }

    return fixtureList;
}

function simulateRound(fixtureList, roundNumber) {
    const roundIndex = roundNumber; 
    const roundMatches = fixtureList[roundIndex];
    const results = [];

    if (roundMatches) {
        roundMatches.forEach(match => {
            
            const [homeTeam, awayTeam] = match.split(' vs ');
            const homeGoals = Math.floor(Math.random() * 5); 
            const awayGoals = Math.floor(Math.random() * 5); 
            results.push(`${homeTeam} ${homeGoals} - ${awayGoals} ${awayTeam}`);

        fixtureList.push(results)            
        });
    } else {
        console.log("No matches found for round", roundNumber);
    }

    return results;
}

const fixtureList = extractFixtures();
const roundResults = simulateRound(fixtureList, roundNumber);

function saveResults() {
    localStorage.setItem('roundResults', JSON.stringify(roundResults));
}

    const savedResults = localStorage.getItem('roundResults');
    if (savedResults) {
        const matchResults = JSON.parse(savedResults);
        updateTeamStatistics(matchResults);
        renderResultList(fixtureList, roundNumber);
    }

function renderResultList(fixtureList, roundNumber) {
    const fixtureListDiv = document.getElementById('fixtureList');
    fixtureListDiv.innerHTML = '<h2>Fixtures</h2>';
    
    const roundIndex = roundNumber + 1;
    const roundMatches = fixtureList[roundIndex];

    if (roundMatches) {
        const teamHeader = document.createElement('h3');
        teamHeader.textContent = `Round ${roundIndex}`;
        fixtureListDiv.appendChild(teamHeader);

        const resultList = document.createElement('ul');
        roundMatches.forEach(results => {
            const resultItem = document.createElement('li');
            resultItem.textContent = results;
            resultList.appendChild(resultItem);
        });
        fixtureListDiv.appendChild(resultList);
    } else {
        console.log("No matches found", fixtureList)
    };    
}

function extractMatchResult(result) {
    const matchResult = result.match(/^(.+) (\d+) - (\d+) (.+)$/);
    if (matchResult) {
        const [, homeTeam, homeGoals, awayGoals, awayTeam] = matchResult;
        return [homeTeam, parseInt(homeGoals),  parseInt(awayGoals), awayTeam];
    } else {
        console.error("Invalid match result format:", result);
        return null;
    }
}


function updateTeamStatistics(matchResults) {
    if (Array.isArray(matchResults)) {
        matchResults.forEach(result => {
            const matchResult = extractMatchResult(result);
            if (matchResult) {
                const [homeTeam, homeGoals, awayGoals, awayTeam] = matchResult;
                updateTeam(homeTeam, homeGoals, awayGoals);
                updateTeam(awayTeam, awayGoals, homeGoals);
            }
        });
    
        renderTeamList();
    } else {
        console.error(`matchResults is not an array`);
    }
}

function updateTeam(team, goalsFor, goalsAgainst) {
    const teamStats = getTeamStatistics(team);
    teamStats.goalsFor += goalsFor;
    teamStats.goalsAgainst += goalsAgainst;
    teamStats.matchesPlayed ++
    if (goalsFor > goalsAgainst) {
        teamStats.points +=3; 
    } else if (goalsFor === goalsAgainst) {
        teamStats.points +=1;
    }
    localStorage.setItem(team, JSON.stringify(teamStats));
    console.log(teamStats);
}


updateTeam(team, goalsFor, goalsAgainst)        

// Function to sort teams in the league table
function sortTeams() {
    // Sort the league table based on points, goal difference, etc.
    // Implementation depends on your existing code structure
}

// Function to render the league table
function renderLeagueTable() {
    // Render the league table with updated statistics
    // Implementation depends on your existing code structure
}

