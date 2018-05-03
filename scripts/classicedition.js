function Square(name, pricetext, color, price, groupNumber, baseRent, rent1, rent2, rent3, rent4, rent5) {
    this.name = name;
    this.pricetext = pricetext;
    this.color = color;
    this.owner = 0;
    this.mortgage = false;
    this.house = 0;
    this.hotel = 0;
    this.groupNumber = groupNumber || 0;
    this.price = (price || 0);
    this.baseRent = (baseRent || 0);
    this.rent1 = (rent1 || 0);
    this.rent2 = (rent2 || 0);
    this.rent3 = (rent3 || 0);
    this.rent4 = (rent4 || 0);
    this.rent5 = (rent5 || 0);
    this.landcount = 0;

    if (groupNumber === 3 || groupNumber === 4) {
        this.housePrice = 50;
    } else if (groupNumber === 5 || groupNumber === 6) {
        this.housePrice = 100;
    } else if (groupNumber === 7 || groupNumber === 8) {
        this.housePrice = 150;
    } else if (groupNumber === 9 || groupNumber === 10) {
        this.housePrice = 200;
    } else {
        this.housePrice = 0;
    }
}

class Card {
    constructor (text, action) {
        this.text = text;
        this.action = action
    }
}

function corrections() {
    document.getelementbyid("cell1name").textcontent = "mediter-ranean avenue";

    // add images to enlarges.
    document.getelementbyid("enlarge5token").innerhtml += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; bottom: 20px;" />';
    document.getelementbyid("enlarge15token").innerhtml += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getelementbyid("enlarge25token").innerhtml += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getelementbyid("enlarge35token").innerhtml += '<img src="../images/train_icon.png" height="60" width="65" alt="" style="position: relative; top: -20px;" />';
    document.getelementbyid("enlarge12token").innerhtml += '<img src="../images/electric_icon.png" height="60" width="48" alt="" style="position: relative; top: -20px;" />';
    document.getelementbyid("enlarge28token").innerhtml += '<img src="../images/water_icon.png" height="60" width="78" alt="" style="position: relative; top: -20px;" />';
}

function utilText() {
    return '&nbsp;&nbsp;&nbsp;&nbsp;if one "utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;if both "utilitys" are owned rent is 10 times amount shown on dice.';
}

function transText() {
    return '<div style="font-size: 14px; line-height: 1.5;">rent<span style="float: right;">$25.</span><br />if 2 railroads are owned<span style="float: right;">50.</span><br />if 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />if 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>';
}

function luxuryTax() {
    addalert(player[turn].name + " заплатите $100 за попадание на luxury tax.");
    player[turn].pay(100, 0);

    $("#landed").show().text("вы попали на luxury tax. заплатите $100.");
}

function cityTax () {
    addalert(player[turn].name + " заплатите $100 за попадание на city tax.");
    player[turn].pay(200, 0);
    $("#landed").show().text("вы попали на city tax. заплатите $200.");
}

let square = [];

square[0] = new Square("старт", "получите $200 при проходе через эту клетку.", "#ffffff");
square[1] = new Square("проспект богдан хмельницкого", "$60", "#8b4513", 60, 3, 2, 10, 30, 90, 160, 250);
square[2] = new Square("community chest", "следуйте инструкциям на верхней карточке", "#ffffff");
square[3] = new Square("оплот", "$60", "#8b4513", 60, 3, 4, 20, 60, 180, 320, 450);
square[4] = new Square("первое республиканское такси", "заплатите $200", "#ffffff");
square[5] = new Square("донецкий жд вокзал", "$200", "#ffffff", 200, 1);
square[6] = new Square("площадь ленина", "$100", "#87ceeb", 100, 4, 6, 30, 90, 270, 400, 550);
square[7] = new Square("коммендантский час", "следуйте инструкциям на верхней карточке", "#ffffff");
square[8] = new Square("бургер бар", "$100", "#87ceeb", 100, 4, 6, 30, 90, 270, 400, 550);
square[9] = new Square("connecticut avenue", "$120", "#87ceeb", 120, 4, 8, 40, 100, 300, 450, 600);
square[10] = new Square("just visiting", "", "#ffffff");
square[11] = new Square("st. charles place", "$140", "#ff0080", 140, 5, 10, 50, 150, 450, 625, 750);
square[12] = new Square("electric company", "$150", "#ffffff", 150, 2);
square[13] = new Square("states avenue", "$140", "#ff0080", 140, 5, 10, 50, 150, 450, 625, 750);
square[14] = new Square("virginia avenue", "$160", "#ff0080", 160, 5, 12, 60, 180, 500, 700, 900);
square[15] = new Square("pennsylvania railroad", "$200", "#ffffff", 200, 1);
square[16] = new Square("st. james place", "$180", "#ffa500", 180, 6, 14, 70, 200, 550, 750, 950);
square[17] = new Square("community chest", "следуйте инструкциям на верхней карточке", "#ffffff");
square[18] = new Square("tennessee avenue", "$180", "#ffa500", 180, 6, 14, 70, 200, 550, 750, 950);
square[19] = new Square("new york avenue", "$200", "#ffa500", 200, 6, 16, 80, 220, 600, 800, 1000);
square[20] = new Square("free parking", "", "#ffffff");
square[21] = new Square("kentucky avenue", "$220", "#ff0000", 220, 7, 18, 90, 250, 700, 875, 1050);
square[22] = new Square("chance", "следуйте инструкциям на верхней карточке", "#ffffff");
square[23] = new Square("indiana avenue", "$220", "#ff0000", 220, 7, 18, 90, 250, 700, 875, 1050);
square[24] = new Square("illinois avenue", "$240", "#ff0000", 240, 7, 20, 100, 300, 750, 925, 1100);
square[25] = new Square("b&o railroad", "$200", "#ffffff", 200, 1);
square[26] = new Square("atlantic avenue", "$260", "#ffff00", 260, 8, 22, 110, 330, 800, 975, 1150);
square[27] = new Square("ventnor avenue", "$260", "#ffff00", 260, 8, 22, 110, 330, 800, 975, 1150);
square[28] = new Square("water works", "$150", "#ffffff", 150, 2);
square[29] = new Square("marvin gardens", "$280", "#ffff00", 280, 8, 24, 120, 360, 850, 1025, 1200);
square[30] = new Square("go to jail", "попадаете прямиком в тюрьму. не проходите через клетку go. не получаете $200", "#ffffff");
square[31] = new Square("pacific avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
square[32] = new Square("north carolina avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
square[33] = new Square("community chest", "следуйте инструкциям на верхней карточке", "#ffffff");
square[34] = new Square("pennsylvania avenue", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
square[35] = new Square("short line", "$200", "#ffffff", 200, 1);
square[36] = new Square("chance", "следуйте инструкциям на верхней карточке", "#ffffff");
square[37] = new Square("park place", "$350", "#0000ff", 350, 10, 35, 175, 500, 1100, 1300, 1500);
square[38] = new Square("luxury tax", "заплатите $100", "#ffffff");
square[39] = new Square("boardwalk", "$400", "#0000ff", 400, 10, 50, 200, 600, 1400, 1700, 2000);

let communityChestCards = [];
let chanceCards = [];

communityChestCards[0] = new Card("выйти из тюрьмы, свобода. эту карточку можно сохранить до момента надобности или продажи .", function (p) {
    p.communityChestJailCard = true;
    updateOwned();
});
communityChestCards[1] = new Card("вы заняли второе место в конкурсе красоты. получите $10.", function () {
    addAmount(10, 'community chest');
});
communityChestCards[2] = new Card("с продажи акций вы получите $50.", function () {
    addAmount(50, 'community chest');
});
communityChestCards[3] = new Card("получите $100 со страховки.", function () {
    addAmount(100, 'community chest');
});
communityChestCards[4] = new Card("возврат налога с доходов. получите $20.", function () {
    addAmount(20, 'community chest');
});
communityChestCards[5] = new Card("получите $100 с праздничного фонда .", function () {
    addAmount(100, 'community chest');
});
communityChestCards[6] = new Card("вы получаете $100 по наслдству.", function () {
    addAmount(100, 'community chest');
});
communityChestCards[7] = new Card("получите $25 с консультаций.", function () {
    addAmount(25, 'community chest');
});
communityChestCards[8] = new Card("вы попали в больницу. заплатите $100 .", function () {
    subtractAmount(100, 'community chest');
});
communityChestCards[9] = new Card("ошибка банка в вашу пользу. получите $200.", function () {
    addAmount(200, 'community chest');
});
communityChestCards[10] = new Card("заплатите школьные налоги $50.", function () {
    subtractAmount(50, 'community chest');
});
communityChestCards[11] = new Card("услуги доктора. заплатите $50.", function () {
    subtractAmount(50, 'community chest');
});
communityChestCards[12] = new Card("сейчас ваш день рождения. соберите $10 с каждого игрока.", function () {
    collectfromeachplayer(10, 'community chest');
});
communityChestCards[13] = new Card("advance to \"go\" (collect $200).", function () {
    advance(0);
});
communityChestCards[14] = new Card("с вас вас взымаются выплаты: $40 за дом, $115 за отель.", function () {
    streetRepairs(40, 115);
});
communityChestCards[15] = new Card("отправиться  в тюрьму. отправляетесь прямо в тюрьму. не проходите \"старт\". не получаете $200.", function () {
    gotoJail();
});


chanceCards[0] = new Card("выйти из тюрьмы, свобода. эту карточку можно сохранить до момента надобности или продажи .", function (p) {
    p.chanceJailCard = true;
    updateOwned();
});
chanceCards[1] = new Card("массовое устранение наполадков на ваших предприятиях. за каждый дом заплатите $25. за каждый отель - $100.", function () {
    streetRepairs(25, 100);
});
chanceCards[2] = new Card("штраф ща превышение скорости $15.", function () {
    subtractAmount(15, 'chance');
});
chanceCards[3] = new Card("вы платите $50 каждому игроку за столом и становитесь его председателем.", function () {
    payEachPlayer(50, 'chance');
});
chanceCards[4] = new Card("перейти назад на 3 клетки.", function () {
    goBackThreeSpaces();
});
chanceCards[5] = new Card("advance to the nearest utility. if unowned, you may buy it from the bank. if owned, throw dice and pay owner a total ten times the amount thrown.", function () {
    advanceToNearestUtility();
});
chanceCards[6] = new Card("bank pays you dividend of $50.", function () {
    addAmount(50, 'chance');
});
chanceCards[7] = new Card("advance to the nearest railroad. if unowned, you may buy it from the bank. if owned, pay owner twice the rental to which they are otherwise entitled.", function () {
    advanceToNearestRailRoad();
});
chanceCards[8] = new Card("pay poor tax of $15.", function () {
    subtractAmount(15, 'chance');
});
chanceCards[9] = new Card("take a trip to reading rail road. if you pass \"go\" collect $200.", function () {
    advance(5);
});
chanceCards[10] = new Card("advance to boardwalk.", function () {
    advance(39);
});
chanceCards[11] = new Card("advance to illinois avenue. if you pass \"go\" collect $200.", function () {
    advance(24);
});
chanceCards[12] = new Card("your building loan matures. collect $150.", function () {
    addAmount(150, 'chance');
});
chanceCards[13] = new Card("advance to the nearest railroad. if unowned, you may buy it from the bank. if owned, pay owner twice the rental to which they are otherwise entitled.", function () {
    advanceToNearestRailRoad();
});
chanceCards[14] = new Card("advance to st. charles place. if you pass \"go\" collect $200.", function () {
    advance(11);
});
chanceCards[15] = new Card("go to jail. go directly to jail. do not pass \"go\". do not collect $200.", function () {
    gotoJail();
});
