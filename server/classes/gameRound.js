class Rounds {
  gameRounds = {};

  // setRounds(gameId) {
  //   this.gameRounds[gameId].rounds = [];
  // }

  getRound(gameId) {
    if (this.gameRounds[gameId]) {
      return this.gameRounds[gameId].rounds.length + 1;
    }
    return null;
  }

  addRound(gameId, cube) {
    this.gameRounds[gameId].rounds.push(cube);
  }

  changeDiceInRound(gameId, round, cube) {
    if (this.gameRounds[gameId].rounds[round - 1]) {
      this.gameRounds[gameId].rounds[round - 1] = cube;
    } else {
      return null;
    }
  }

  setReserve(gameId, array) {
    if (this.gameRounds[gameId]) {
      this.gameRounds[gameId].reserve = array;
    } else {
      return null;
    }
  }

  removeFromReserve(gameId, cube) {
    if (this.gameRounds[gameId].reserve.length) {
      const needIndex = this.gameRounds[gameId].reserve.findIndex(
        (elem) => cube.color === elem.color && cube.number === elem.number
      );

      this.gameRounds[gameId].reserve = this.gameRounds[gameId].reserve.filter(
        (_, index) => index !== needIndex
      );
    } else {
      return null;
    }
  }

  addGame(gameId, players) {
    this.gameRounds[gameId] = {
      cubes: [
        { color: 'blue', count: 18 },
        { color: 'green', count: 18 },
        { color: 'purple', count: 18 },
        { color: 'red', count: 18 },
        { color: 'yellow', count: 18 },
      ],
      rounds: [],
      reserve: null,
      players,
      activePlayer: null,
      playersQueue: null,
    };
  }

  static randomDiceNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  static randomArrayElement(min, max, arrayAvailableCubes) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(randomNum, max, min);
    return arrayAvailableCubes[randomNum];
  }

  static numberOfGivenCubes(numberPlayers) {
    switch (numberPlayers) {
      case 1:
        return 4;
      case 2:
        return 5;
      case 3:
        return 7;
      case 4:
        return 9;
      default:
        return false;
    }
  }

  giveArrayAvailableCubes(gameId) {
    return this.gameRounds[gameId].cubes
      .map((cubes) =>
        new Array(cubes.count).fill('elem').map(() => {
          const number = Rounds.randomDiceNumber();
          return { color: cubes.color, number };
        })
      )
      .flat();
  }

  removeRolledCubes(cubes, gameId) {
    cubes.forEach((cube) => {
      this.gameRounds[gameId].cubes = this.gameRounds[gameId].cubes.map(
        (elem) => {
          if (elem.color === cube.color) {
            return {
              ...elem,
              count: elem.count - 1,
            };
          }
          return elem;
        }
      );
    });
  }

  rollTheDice(gameId, numberPlayers) {
    const numberOfCubesNeeded = Rounds.numberOfGivenCubes(numberPlayers);
    const arrayAvailableCubes = this.giveArrayAvailableCubes(gameId);
    const cubes = [];
    console.log(numberOfCubesNeeded);
    while (numberOfCubesNeeded > cubes.length) {
      console.log(numberOfCubesNeeded);
      const randomElement = Rounds.randomArrayElement(
        0,
        arrayAvailableCubes.length - 1,
        arrayAvailableCubes
      );
      console.log(randomElement);
      cubes.push(randomElement);
    }

    this.removeRolledCubes(cubes, gameId);
    return cubes;
  }

  static shufflePlayers(players) {
    return players
      .map((player) => [Math.random(), player])
      .sort()
      .map((player) => player[1]);
  }

  setTurnOrder(gameId) {
    const { players } = this.gameRounds[gameId];
    console.log(players);
    let mixedPlayers = Rounds.shufflePlayers(players);
    console.log(mixedPlayers);
    let numberRounds = 10;

    const orderMoves = [];

    while (numberRounds > 0) {
      const arrayPerRound = [];

      mixedPlayers.forEach((player, index) => {
        if (index === mixedPlayers.length - 1) {
          arrayPerRound.push(player, player);
        } else {
          arrayPerRound.push(player);
        }
      });

      mixedPlayers.reverse();

      mixedPlayers.forEach((reversePlayer, index) => {
        if (index) {
          arrayPerRound.push(reversePlayer);
        }
      });

      mixedPlayers.reverse();
      mixedPlayers = mixedPlayers.splice(+1).concat(mixedPlayers);

      orderMoves.push(arrayPerRound);
      numberRounds -= 1;
    }
    this.gameRounds[gameId].playersQueue = orderMoves;
    return orderMoves;
  }

  nextActivePlayer(gameId) {
    if (this.gameRounds[gameId].playersQueue.length > 0) {
      const first = this.gameRounds[gameId].playersQueue[0][0];
      this.gameRounds[gameId].playersQueue[0] =
        this.gameRounds[gameId].playersQueue[0].slice(1);
      if (this.gameRounds[gameId].playersQueue[0].length === 0) {
        this.gameRounds[gameId].playersQueue =
          this.gameRounds[gameId].playersQueue.slice(1);
      }
      return first;
    }
    return null;
  }
}

const rounds = new Rounds();
// console.log(rounds.addGame(45, ['Вика', 'Вася', 'Петя', 'Даша']))
// console.log(rounds.addRound(45, { color: 'red', number: 'two' }))
// console.log(rounds.gameRounds[45])
// console.log(rounds.getRound(45))
// console.log(rounds.changeDiceInRound(45, 1, { color: 'yellow', number: 'six' }))
// console.log(rounds.gameRounds[45])
// console.log(rounds.setReserve(45, [{ color: 'red', number: 'two' },{color: 'green', number: 'two' },{ color: 'red', number: 'two' },{ color: 'red', number: 'two' },{ color: 'red', number: 'two' }]))
// console.log(rounds.gameRounds[45])
// console.log(rounds.removeFromReserve(45, {color: 'green', number: 'two'}))
// console.log(rounds.gameRounds[45])
// console.log(Rounds.numberOfGivenCubes(2))
// console.log(rounds.giveArrayAvailableCubes(45))
// console.log(rounds.rollTheDice(45, 2))
// console.log(rounds.setTurnOrder(45))
// console.log(rounds.setTurnOrder(45))
// console.log(rounds.getActivePlayer(45))
// console.log(rounds.nextActivePlayer(45))

module.exports = rounds;