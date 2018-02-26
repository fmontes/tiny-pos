const stateMap = new Map();

class State {
    constructor(id) {
        this.key = id;
    }

    addItem(item) {
        const exitingItem = stateMap.get(item[this.key]);

        if (exitingItem) {
            exitingItem.quantity++
            stateMap.set(exitingItem[this.key], exitingItem);
        } else {
            item.quantity = 1;
            stateMap.set(item[this.key], item);
        }
    }

    getAll() {
        return Array.from(stateMap.values());
    }

    getItem(item) {
        return stateMap.get(item);
    }

    getItemProperty(item, prop) {
        return this.getItem(item)[prop];
    }

    itemExist(item) {
        return stateMap.has(item);
    }

    isNotEmpty() {
        return !!stateMap.size;
    }

    reset() {
        stateMap.clear();
    }
}
