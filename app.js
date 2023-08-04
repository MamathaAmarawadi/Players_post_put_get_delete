const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const filePath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());
let db = null;
const initialization = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, (request, response) => {
      console.log("server running at localhost://3000");
    });
  } catch (e) {
    console.log(`server error ${e.message}`);
    process.exit(1);
  }
};

initialization();

//get method
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getQuery = `select * from cricket_team;`;
  const getdata = await db.all(getQuery);
  //response.send(getdata);
  response.send(
    getdata.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//post method

app.post("/players/", async (request, response) => {
  const bdy = request.body;
  const { playerName, jerseyNumber, role } = bdy;
  const addQuery = `
insert into cricket_team(player_name,jersey_number,role)
values('${playerName}',
'${jerseyNumber}',
'${role}');`;
  const adddata = await db.run(addQuery);
  const final = adddata.lastID;
  //response.send({ player_id: final });
  response.send("Player Added to Team");
});

//get method

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getNumberQuery = `select * from cricket_team
  where player_id='${playerId}';`;
  const new_up = await db.get(getNumberQuery);
  const { player_id, player_name, jersey_number, role } = new_up;
  const ob = {
    playerId: player_id,
    playerName: player_name,
    jerseyNumber: jersey_number,
    role: role,
  };
  response.send(ob);
});

//put method

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const querybody = request.body;
  const { playerName, jerseyNumber, role } = querybody;
  const updatedQuery = `
update cricket_team set
player_name='${playerName}',
jersey_number='${jerseyNumber}',
role='${role}'
where player_id='${playerId}';`;
  await db.run(updatedQuery);
  response.send("Player Details Updated");
});

//delete method

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletedQuery = `delete from cricket_team
 where player_id='${playerId}';`;
  await db.run(deletedQuery);
  response.send("Player Removed");
});

module.exports = app;
