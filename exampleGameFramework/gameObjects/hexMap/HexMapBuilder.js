import noise from "../../utilities/perlin";

export default class HexMapBuilderClass {

   constructor(hexMapData) {

      this.hexMapData = hexMapData;

   }

   generateMap = (Qgen, Rgen) => {

      for (let r = 0; r < Rgen; r++) {
         for (let q = -1 * Math.floor(r / 2); q < Qgen - Math.floor(r / 2); q++) {
            this.hexMapData.setEntry(q, r, {
               data: null
            })
         }
      }
   }

   removeNoiseTiles = (noiseFluctuation, noiseSeedMultiplier, noiseThreshold) => {

      let seed = Math.random() * noiseSeedMultiplier;

      for (let [key, value] of this.hexMapData.getMap()) {

         let keyObj = this.hexMapData.split(key);

         let tileNoise = noise(seed+keyObj.q/noiseFluctuation, seed+keyObj.r/noiseFluctuation);

         if(tileNoise < noiseThreshold) this.hexMapData.deleteEntry(keyObj.q, keyObj.r);

      }
      

   }

   deleteIslands = () => {

      let keyStrings = this.hexMapData.keyStrings();
      let tileGroups = [];

      let getNeighborKeysInList = (q, r) => {
         let neighbors = this.hexMapData.getNeighborKeys(q, r);
         let filteredNeighbors = [];

         for (let i = 0; i < neighbors.length; i++) {
            if (!keyStrings.includes(this.hexMapData.join(neighbors[i].q, neighbors[i].r))) continue;
            filteredNeighbors.push(neighbors[i]);
         }

         return filteredNeighbors;
      }

      let addNeighbors = (keyString, tileGroup) => {

         tileGroup.add(keyString);

         let keyIndex = keyStrings.indexOf(keyString);
         if (keyIndex != -1) keyStrings.splice(keyIndex, 1);

         let key = this.hexMapData.split(keyString);
         let neighbors = getNeighborKeysInList(key.q, key.r);

         for (let i = 0; i < neighbors.length; i++) {
            addNeighbors(this.hexMapData.join(neighbors[i].q, neighbors[i].r), tileGroup);
         }
      }

      while (keyStrings.length > 0) {

         let tileGroup = new Set();
         addNeighbors(keyStrings[0], tileGroup);
         tileGroups.push(Array.from(tileGroup));

      }

      let tileGroupLengths = tileGroups.map(tileGroup => tileGroup.length);
      let longestTileGroupIndex = tileGroupLengths.indexOf(Math.max(...tileGroupLengths));
      tileGroups.splice(longestTileGroupIndex, 1);

      let tilesToRemove = [].concat(...tileGroups);

      for (let i = 0; i < tilesToRemove.length; i++) {
         let key = this.hexMapData.split(tilesToRemove[i])
         this.hexMapData.deleteEntry(key.q, key.r);
      }

   }

   
   build = (q, r, mapSize, mapGeneration) => {

      let noiseFluctuation = (mapSize == "small" ? 3 : mapSize == "medium" ? 4 : 5)
      let noiseSeedMultiplier = 10
      let noiseThreshold = 0.4

      if (mapGeneration == true) {
            this.generateMap(q, r);
            this.removeNoiseTiles(noiseFluctuation, noiseSeedMultiplier, noiseThreshold);
            this.deleteIslands();
      } else {
            this.generateMap(q, r);
      }
   }

}