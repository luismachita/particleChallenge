module.exports = class Animation {

    constructor () {
        // stores arrays of strings representing particle motion
        this.particleArrays = [];
    }

    /**
     * Iterates through an array in order to add or replace elements
     * and map particle motion
     * @param array
     * @param firstPosition
     * @param secondPosition
     * @param firstReplaceItem
     * @param arrayHashReference
     */
    arrayReplace (array, firstPosition, secondPosition, firstReplaceItem, arrayHashReference) {

        // particle moves and leaves behind a '.'
        array.splice(firstPosition, 1, firstReplaceItem);

        // particle lands in a second position in the array
        if (secondPosition <= (array.length - 1) && secondPosition >= 0 ) {
            array.splice(secondPosition, 1, arrayHashReference[firstPosition]);
        }
    }

    /**
     * Visualizes the state of particles at one specific moment of their motion
     * @param array
     * @returns string
     */
    visualizeParticles (array) {

        // why new array? Because the array from which this is generated is getting
        // updated, so we need to keep distinct references at each stage
        const newArray = array.slice(0);
        return newArray.map((elem) => {
            if (elem === 'R' || elem === 'L') {
                return 'X';
            }
            return elem;
        }).join('');
    }

    /**
     * Utility function that maps array-like objects into JS objects
     * @param array
     * @param object
     * @returns {Uint8Array | BigInt64Array | any[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
     */
    mapArrayIntoObject (array, object) {
        return array.map((elem, index) =>  {
            object[index] = elem;
        })
    }


    /**
     * This method traverses an array of directions
     * and attempts to map the movement of particles through space
     * @param hash
     * @param speed
     * @param arrayHash
     * @returns {*}
     */
    iterateUntilEmpty (stateHash, speed, directionsHash) {

        const self = this;

        // condition to get out of recursion
        if (!stateHash.state.includes('L') && (!stateHash.state.includes('R'))) {
            console.log((self.particleArrays));
            // returns an array of strings representing the particles in motion
            return self.particleArrays;
        }

        stateHash.state.forEach( (elem, index) => {
            if (elem === 'R') {
                self.arrayReplace(stateHash.state, index, index + speed, '.', directionsHash);
                // update our particle arrays and store their reference in the instance
                self.particleArrays.push(self.visualizeParticles(stateHash.state));
                return;
            } else if (elem === 'L') {
                self.arrayReplace(stateHash.state, index, index - speed, '.', directionsHash);
                // update our particle arrays and store their reference in the instance
                self.particleArrays.push(self.visualizeParticles(stateHash.state));
                return;
            }
            // at each iteration, the references to the state of motion
            // have changed, so we update them
            stateHash.state.forEach((elem, index) => {
                directionsHash[index] = elem;
            });
        });

        // invoke itself recursively
        return self.iterateUntilEmpty(stateHash, speed, directionsHash);

    };

    /**
     * Creates an animation of particles moving
     * @param speed
     * @param init
     */
    animate (speed, init) {

        const self = this;
        self.particleArrays = [];

        // split init string into an array
        const arrayOfDirections = init.split('');

        // create an object that has a reference to the first
        // state of motion of the particles
        const directionsHash = {};
        self.mapArrayIntoObject(arrayOfDirections, directionsHash);

        // clear particle snapshots and declare the initial state
        // of their motion in one object
        const stateHash = {};
        stateHash.state = arrayOfDirections;

        // as an initial snapshot of particles, we need the visualized particles,
        // not the real directions
        self.particleArrays.push(self.visualizeParticles(arrayOfDirections));


        self.iterateUntilEmpty(stateHash, speed, directionsHash);

    }
};