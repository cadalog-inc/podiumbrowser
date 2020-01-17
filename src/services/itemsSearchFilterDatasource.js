const itemFilterSearchSource = [
    { itemid: 1, item: "furniture" },
    { itemid: 2, item: "faucet" },
    { itemid: 3, item: "bath tub" },
    { itemid: 4, item: "fridge" },
    { itemid: 5, item: "bidet" },
    { itemid: 6, item: "shower curtain" },
    { itemid: 7, item: "couch" },
    { itemid: 8, item: "chair" },
    { itemid: 9, item: "oven" },
    { itemid: 10, item: "flowers" },
    { itemid: 11, item: "shower curtain" },
    { itemid: 12, item: "doorknob" },
    { itemid: 13, item: "garage door" },
    { itemid: 14, item: "car" },
    { itemid: 15, item: "motorcycle" },
    { itemid: 16, item: "concrete wall" },
    { itemid: 17, item: "wooden chair" },
    { itemid: 18, item: "twin size bed" },
    { itemid: 19, item: "king size bed" },
    { itemid: 20, item: "freezer" },
    { itemid: 21, item: "metal pipes" },
    { itemid: 22, item: "plastic pipes" },
    { itemid: 23, item: "house plant" },
    { itemid: 24, item: "speakers" },
    { itemid: 25, item: "headphones" },
];

export function getDataSourceInfo() {
    return itemFilterSearchSource;
}

export function renderSearchSuggestion(state, val) {
    return (
        state.item.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
}