const itemTagsList = [
    {
        id: 1,
        title: "Roche Bobois Bubble sofa 2 seater",
        tags: [
            "furniture", "sofas", "3d", "structure", "fabric", "wood", "living", "sofa", "seat", "paid", "yellow", "sitting", "plywood",
            "board", "suspension", "2 seater", "large", "bubble", "padded", "solid", "upholstery", "foam", "unique", "wrap", "roche", "bobois",
            "roche bobois bubble sofa 2 seater", "techno", "elastic", "particle", "bi-density", "living room", "one of a kind"
        ],
        uploadDate: 1432188706,
        fileSize: 5414068,
    },
    {
        id: 2,
        title: "Roche Bobois Bubble sofa 3 seater",
        tags: [
            "furniture", "sofas", "3d", "structure", "fabric", "wood", "living", "sofa", "seat", "paid", "grey", "sitting", "plywood",
            "board", "suspension", "3 seater", "large", "bubble", "padded", "solid", "upholstery", "foam", "unique", "wrap", "roche",
            "bobois", "techno", "elastic", "particle", "bi-density", "living room", "roche bobois bubble sofa 3 seater", "strange"
        ],
        uploadDate: 1432188707,
        fileSize: 6862804
    },
    {
        id: 3,
        title: "Hadco Decklyte GADL1",
        tags: [
            "exterior", "wall", "decoration", "fixtures", "paid", "brown", "individual", "elegant", "lighting", "contemporary", "design",
            "character", "unique", "styling", "voltage", "hadco", "decklyte", "gadl1", "luminescent", "ambience", "hadco decklyte gadl1"
        ],
        uploadDate: 1432102267,
        fileSize: 177123
    },
    {
        id: 4,
        title: "Hadco Decklyte CUL20",
        tags: [
            "exterior", "wall", "decoration", "soft", "light", "fixtures", "paid", "brown", "rounded", "individual", "elegant", "lighting",
            "contemporary", "design", "character", "unique", "styling", "voltage", "hidden", "charm", "hadco", "decklyte", "cul20", "luminescent",
            "ambience", "hadco decklyte cul20"
        ],
        uploadDate: 1432102262,
        fileSize: 189926
    },
    {
        id: 5,
        title: "Hadco Pathlyte VPSL2",
        tags: [
            "exterior", "decoration", "ground", "lamp", "soft", "blue", "light", "fixtures", "paid", "rounded", "individual", "elegant", "lighting",
            "contemporary", "design", "character", "unique", "styling", "voltage", "hidden", "charm", "hadco", "pathlyte", "vpsl2", "luminescent",
            "ambience", "hadco pathlyte vpsl2"
        ],
        uploadDate: 1432102261,
        fileSize: 3858231
    },

];


function createItemTagsArray() {

    let itemTagArray = [];
    const itemlist = getItemTagsList();

    for (let i = 0; i < itemlist.length; i++) {
        for (let j = 0; j < itemlist[i].tags.length; j++) {
            if (itemTagArray.length === 0) {
                itemTagArray.push({ tag: itemlist[i].tags[j], pos: itemTagArray.indexOf(itemlist[i].tags[j]) });
            }
            else if (itemTagArray.indexOf(itemlist[i].tags[j]) === -1) {
                itemTagArray.push({ tag: itemlist[i].tags[j], pos: itemTagArray.indexOf(itemlist[i].tags[j]) });
            }
        }
    }

    return itemTagArray;
}

function getItemTagsList() {
    return itemTagsList;
}

export function getItemTagsArray() {
    return createItemTagsArray();
}