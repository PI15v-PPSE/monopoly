/**
 * Игра
 *
 * Класс описывает игровой процесс.
 *
 * @author Gumbeat
 * @version 0.0.1
 * @copyright GNU Public License
 */

function Game() {
    /**
     * Первая игровая кость
     *
     * Используем целочисленное значение
     * переменной для обозначения
     * количества очков на первом кубике.
     *
     * @var {int} die1
     */
    let die1;
    /**
     * Вторая игровая кость
     *
     * Используем целочисленное значение
     * переменной для обозначения
     * количества очков на втором кубике.
     *
     * @var {int} die2
     */
    let die2;
    /**
     * Состояние костей
     *
     * Булевая переменная,
     * показывающая, брошены ли кубики
     *
     * @var {boolean} areDiceRolled
     */
    let areDiceRolled = false;

    /**
     * Аукционная очередь
     *
     * Очередь, в которой содержаться
     * всё текущее аукционное
     * имущество
     *
     * @var {Array} auctionQueue
     */
    let auctionQueue = [];
    /**
     * Игрок с наивысшей ставкой
     *
     * Id игрока, сделавшего
     * наивысшую ставку в аукционе
     * на данный момент
     *
     * @var {int} highestBidder
     */
    let highestBidder;
    /**
     * Наивысшая ставка
     *
     * Еаивысшая ставка в аукционе
     * на данный момент
     *
     * @var {int} highestBid
     */
    let highestBid;
    /**
     * Участник, делающий ставку
     *
     * Id игрока, очередь которого
     * делать ставку
     *
     * @var {int} currentBidder
     */
    let currentBidder = 1;
    /**
     * Аукционное имущество
     *
     * Id имущества, находящегося
     * на аукционе
     *
     * @var {int} auctionProperty
     */
    let auctionProperty;

    /**
     * Бросок кубиков
     *
     * Получение случайных значений (в пределах от 1 до 6) очков
     * первой и второй игральной кости и присваивает значение
     * true полю @areDiceRolled
     *
     */
    this.rollDice = function () {
        die1 = Math.floor(Math.random() * 6) + 1;
        die2 = Math.floor(Math.random() * 6) + 1;
        areDiceRolled = true
    };

    /**
     * Сброс очков кубиков
     *
     * Присваивает значение
     * false полю @areDiceRolled
     *
     */
    this.resetDice = function () {
        areDiceRolled = false
    };

    /**
     * Следующий ход
     *
     * Производится моделирование сценария
     * для хода следующего игрока.
     *
     */
    this.next = function () {
        if (!p.human && p.money < 0) {
            p.AI.payDebt();

            if (p.money < 0) {
                popup("<p>" + p.name + " стал банкротом. All of its assets will be turned over to " + player[p.creditor].name + ".</p>", game.bankruptcy)
            } else {
                roll()
            }

        } else if (areDiceRolled && doublecount === 0) {
            play()
        } else {
            roll()
        }
    };

    /**
     * Получение костей
     *
     * Возвращает значение первой или второй
     * кости, в зависимости от значения переменной
     *
     * @returns {int} Возвращает значение первой
     * или второй кости
     * @param {boolean} die
     */
    this.getDie = function (die) {
        if (die === 1) {
            return die1
        }
        return die2
    };

    // Auction functions:

    /**
     * Расчеты для аукциона
     *
     * Исполняет расчеты для определения
     * результатов аукциона
     *
     */
    let finalizeAuction = function () {
        let p = player[highestBidder];
        let sq = square[auctionProperty];

        if (highestBid > 0) {
            p.pay(highestBid, 0);
            sq.owner = highestBidder;
            addAlert(p.name + " bought " + sq.name + " for $" + highestBid + ".")
        }

        for (let i = 1; i <= pcount; i++) {
            player[i].bidding = true
        }

        $("#popupbackground").hide();
        $("#popupwrap").hide();

        if (!game.auction()) {
            play()
        }
    };

    /**
     * Добавление собственности в аукцион
     *
     * Добавляет в очередь аукционов новое имущество
     *
     * @param {int} propertyIndex
     */
    this.addPropertyToAuctionQueue = function (propertyIndex) {
        auctionQueue.push(propertyIndex)
    };

    /**
     * Аукцион
     *
     * Производит моделирование
     * сценария аукциона
     *
     * @returns {*} Возвращает true при
     * продолжении аукциона, false при завершении
     */
    this.auction = function () {
        if (auctionQueue.length === 0) {
            return false
        }

        index = auctionQueue.shift();

        let s = square[index];

        if (s.price === 0 || s.owner !== 0) {
            return game.auction()
        }

        auctionProperty = index;
        highestBidder = 0;
        highestBid = 0;
        currentBidder = turn + 1;

        if (currentBidder > pcount) {
            currentBidder -= pcount
        }

        popup("<div style='font-weight: bold font-size: 16px margin-bottom: 10px'>Auction <span id='propertyname'></span></div><div>Highest Bid = $<span id='highestBid'></span> (<span id='highestBidder'></span>)</div><div><span id='currentBidder'></span>, it is your turn to bid.</div<div><input id='bid' title='Enter an amount to bid on " + s.name + ".' style='width: 291px' /></div><div><input type='button' value='Bid' onclick='game.auctionBid()' title='Place your bid.' /><input type='button' value='Pass' title='Skip bidding this time.' onclick='game.auctionPass()' /><input type='button' value='Exit Auction' title='Stop bidding on " + s.name + " altogether.' onclick='if (confirm(\"Are you sure you want to stop bidding on this property altogether?\")) game.auctionExit()' /></div>", "blank");

        document.getElementById("propertyname").innerHTML = "<a href='javascript:void(0)' onmouseover='showdeed(" + auctionProperty + ")' onmouseout='hidedeed()' class='statscellcolor'>" + s.name + "</a>";
        document.getElementById("highestBid").innerHTML = "0";
        document.getElementById("highestBidder").innerHTML = "N/A";
        document.getElementById("currentBidder").innerHTML = player[currentBidder].name;
        document.getElementById("bid").onkeydown = function (e) {
            let key = 0;
            let isCtrl = false;
            let isShift = false;

            if (window.event) {
                key = window.event.keyCode;
                isCtrl = window.event.ctrlKey;
                isShift = window.event.shiftKey
            } else if (e) {
                key = e.keyCode;
                isCtrl = e.ctrlKey;
                isShift = e.shiftKey
            }

            if (isNaN(key)) {
                return true
            }

            if (key === 13) {
                game.auctionBid();
                return false
            }

            // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
            if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
                return true
            }

            if (isShift) {
                return false
            }

            // Only allow number keys.
            return (key >= 48 && key <= 57) || (key >= 96 && key <= 105)
        };

        document.getElementById("bid").onfocus = function () {
            this.style.color = "black";
            if (isNaN(this.value)) {
                this.value = ""
            }
        };

        updateMoney();

        if (!player[currentBidder].human) {
            currentBidder = turn; // auctionPass advances currentBidder.
            this.auctionPass()
        }
        return true
    };

    /**
     *
     * Пасс на аукционе
     *
     * Производит моделирование сценария
     * пасса игроком во время аукциона
     *
     */
    this.auctionPass = function () {
        if (highestBidder === 0) {
            highestBidder = currentBidder
        }

        while (true) {
            currentBidder++;

            if (currentBidder > pcount) {
                currentBidder -= pcount
            }

            if (currentBidder === highestBidder) {
                finalizeAuction();
                return
            } else if (player[currentBidder].bidding) {
                let p = player[currentBidder];

                if (!p.human) {
                    let bid = p.AI.bid(auctionProperty, highestBid);

                    if (bid === -1 || highestBid >= p.money) {
                        p.bidding = false;

                        window.alert(p.name + " exited the auction.");
                        continue

                    } else if (bid === 0) {
                        window.alert(p.name + " passed.");
                        continue

                    } else if (bid > 0) {
                        this.auctionBid(bid);
                        window.alert(p.name + " bid $" + bid + ".");
                        continue
                    }
                    return
                } else {
                    break
                }
            }

        }

        document.getElementById("currentBidder").innerHTML = player[currentBidder].name;
        document.getElementById("bid").value = "";
        document.getElementById("bid").style.color = "black"
    };

    /**
     *
     * Ставка на аукционе
     *
     * Производит моделирование сценария
     * ставки игрока во время аукциона
     *
     */
    this.auctionBid = function (bid) {
        bid = bid || parseInt(document.getElementById("bid").value, 10);

        if (bid === "" || bid === null) {
            document.getElementById("bid").value = "Please enter a bid.";
            document.getElementById("bid").style.color = "red"
        } else if (isNaN(bid)) {
            document.getElementById("bid").value = "Your bid must be a number.";
            document.getElementById("bid").style.color = "red"
        } else {

            if (bid > player[currentBidder].money) {
                document.getElementById("bid").value = "You don't have enough money to bid $" + bid + ".";
                document.getElementById("bid").style.color = "red"
            } else if (bid > highestBid) {
                highestBid = bid;
                document.getElementById("highestBid").innerHTML = parseInt(bid, 10);
                highestBidder = currentBidder;
                document.getElementById("highestBidder").innerHTML = player[highestBidder].name;

                document.getElementById("bid").focus();

                if (player[currentBidder].human) {
                    this.auctionPass()
                }
            } else {
                document.getElementById("bid").value = "Your bid must be greater than highest bid. ($" + highestBid + ")";
                document.getElementById("bid").style.color = "red"
            }
        }
    };

    /**
     *
     * Выход из аукциона
     *
     * Производит моделирование сценария
     * пасса игрока из аукциона
     *
     */
    this.auctionExit = function () {
        player[currentBidder].bidding = false;
        this.auctionPass()
    };


    // Trade functions:

    /**
     * Инициатор сделки
     *
     * Переменная указывает на игрока, который начал сделку
     *
     * @var {Player} currentInitiator
     */
    let currentInitiator;

    /**
     * Участник сделки сделки
     *
     * Переменная указывает на игрока, с которым начали сделку
     *
     * @var {Player} currentRecipient
     */
    let currentRecipient;

    // Define event handlers:

    /**
     * Функция-событие на ввод в поле суммы сделки
     *
     * Проверка на ввод символов, которые допустимы
     *
     * @param {event} e
     * @returns {boolean} Возвращает true, если допустить символ
     */
    let tradeMoneyOnKeyDown = function (e) {
        let key = 0;
        let isCtrl = false;
        let isShift = false;


        if (window.event) {
            key = window.event.keyCode;
            isCtrl = window.event.ctrlKey;
            isShift = window.event.shiftKey
        } else if (e) {
            key = e.keyCode;
            isCtrl = e.ctrlKey;
            isShift = e.shiftKey
        }

        if (isNaN(key)) {
            return true
        }

        if (key === 13) {
            return false
        }

        // Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
        if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
            return true
        }

        if (isShift) {
            return false
        }

        // Only allow number keys.
        return (key >= 48 && key <= 57) || (key >= 96 && key <= 105)
    };
    /**
     * Функция-событие на наведение на поле суммы сделки
     *
     * Применяет визуальный эффект при наведении на поле
     */
    let tradeMoneyOnFocus = function () {
        this.style.color = "black";
        if (isNaN(this.value) || this.value === "0") {
            this.value = ""
        }
    };
    /**
     * Функция-событие на поле суммы сделки
     *
     * Проводит валидацию значения
     *
     * @returns {boolean} Возвращает true, если допустить изменение
     */
    let tradeMoneyOnChange = function () {
        $("#proposetradebutton").show();
        $("#canceltradebutton").show();
        $("#accepttradebutton").hide();
        $("#rejecttradebutton").hide();

        let amount = this.value;

        if (isNaN(amount)) {
            this.value = "This value must be a number.";
            this.style.color = "red";
            return false
        }

        amount = Math.round(amount) || 0;
        this.value = amount;

        if (amount < 0) {
            this.value = "This value must be greater than 0.";
            this.style.color = "red";
            return false
        }

        return true
    };

    document.getElementById("trade-leftp-money").onkeydown = tradeMoneyOnKeyDown;
    document.getElementById("trade-rightp-money").onkeydown = tradeMoneyOnKeyDown;
    document.getElementById("trade-leftp-money").onfocus = tradeMoneyOnFocus;
    document.getElementById("trade-rightp-money").onfocus = tradeMoneyOnFocus;
    document.getElementById("trade-leftp-money").onchange = tradeMoneyOnChange;
    document.getElementById("trade-rightp-money").onchange = tradeMoneyOnChange;
    /**
     * Сбросить сделку
     *
     * Функция, которая завершает сделку между участниками
     * @param {Player} initiator
     * @param {Player} recipient
     * @param {boolean} allowRecipientToBeChanged - Можно ли сменить участника сделки
     */
    /**
     * Отмена обмена
     *
     * @param {Object} initiator
     * @param {Object} recipient
     * @param {boolean} allowRecipientToBeChanged
     */
    let resetTrade = function (initiator, recipient, allowRecipientToBeChanged) {
        let currentSquare;
        let currentTableRow;
        let currentTableCell;
        let currentTableCellCheckbox;
        let nameSelect;
        let currentOption;
        let allGroupUninproved;
        let currentName;

        let tableRowOnClick = function (e) {
            let checkboxElement = this.firstChild.firstChild;

            if (checkboxElement !== e.srcElement) {
                checkboxElement.checked = !checkboxElement.checked
            }

            $("#proposetradebutton").show();
            $("#canceltradebutton").show();
            $("#accepttradebutton").hide();
            $("#rejecttradebutton").hide()
        };

        let initiatorProperty = document.getElementById("trade-leftp-property");
        let recipientProperty = document.getElementById("trade-rightp-property");

        currentInitiator = initiator;
        currentRecipient = recipient;

        // Empty elements.
        while (initiatorProperty.lastChild) {
            initiatorProperty.removeChild(initiatorProperty.lastChild)
        }

        while (recipientProperty.lastChild) {
            recipientProperty.removeChild(recipientProperty.lastChild)
        }

        let initiatorSideTable = document.createElement("table");
        let recipientSideTable = document.createElement("table");


        for (let i = 0; i < 40; i++) {
            currentSquare = square[i];

            // A property cannot be traded if any properties in its group have been improved.
            if (currentSquare.house > 0 || currentSquare.groupNumber === 0) {
                continue
            }

            allGroupUninproved = true;
            let max = currentSquare.group.length;
            for (let j = 0; j < max; j++) {

                if (square[currentSquare.group[j]].house > 0) {
                    allGroupUninproved = false;
                    break
                }
            }

            if (!allGroupUninproved) {
                continue
            }

            // Offered properties.
            if (currentSquare.owner === initiator.index) {
                currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
                currentTableRow.onclick = tableRowOnClick;

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellcheckbox";
                currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                currentTableCellCheckbox.type = "checkbox";
                currentTableCellCheckbox.id = "tradeleftcheckbox" + i;
                currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellcolor";
                currentTableCell.style.backgroundColor = currentSquare.color;

                if (currentSquare.groupNumber === 1 || currentSquare.groupNumber === 2) {
                    currentTableCell.style.borderColor = "grey"
                } else {
                    currentTableCell.style.borderColor = currentSquare.color
                }

                currentTableCell.propertyIndex = i;
                currentTableCell.onmouseover = function () {
                    showdeed(this.propertyIndex)
                };
                currentTableCell.onmouseout = hidedeed;

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellname";
                if (currentSquare.mortgage) {
                    currentTableCell.title = "Mortgaged";
                    currentTableCell.style.color = "grey"
                }
                currentTableCell.textContent = currentSquare.name

                // Requested properties.
            } else if (currentSquare.owner === recipient.index) {
                currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
                currentTableRow.onclick = tableRowOnClick;

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellcheckbox";
                currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
                currentTableCellCheckbox.type = "checkbox";
                currentTableCellCheckbox.id = "traderightcheckbox" + i;
                currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellcolor";
                currentTableCell.style.backgroundColor = currentSquare.color;

                if (currentSquare.groupNumber === 1 || currentSquare.groupNumber === 2) {
                    currentTableCell.style.borderColor = "grey"
                } else {
                    currentTableCell.style.borderColor = currentSquare.color
                }

                currentTableCell.propertyIndex = i;
                currentTableCell.onmouseover = function () {
                    showdeed(this.propertyIndex)
                };
                currentTableCell.onmouseout = hidedeed;

                currentTableCell = currentTableRow.appendChild(document.createElement("td"));
                currentTableCell.className = "propertycellname";
                if (currentSquare.mortgage) {
                    currentTableCell.title = "Mortgaged";
                    currentTableCell.style.color = "grey"
                }
                currentTableCell.textContent = currentSquare.name
            }
        }

        if (initiator.communityChestJailCard) {
            currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
            currentTableRow.onclick = tableRowOnClick;

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcheckbox";
            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
            currentTableCellCheckbox.type = "checkbox";
            currentTableCellCheckbox.id = "tradeleftcheckbox40";
            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcolor";
            currentTableCell.style.backgroundColor = "white";
            currentTableCell.style.borderColor = "grey";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellname";

            currentTableCell.textContent = "Get Out of Jail Free Card"
        } else if (recipient.communityChestJailCard) {
            currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
            currentTableRow.onclick = tableRowOnClick;

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcheckbox";
            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
            currentTableCellCheckbox.type = "checkbox";
            currentTableCellCheckbox.id = "traderightcheckbox40";
            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcolor";
            currentTableCell.style.backgroundColor = "white";
            currentTableCell.style.borderColor = "grey";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellname";

            currentTableCell.textContent = "Get Out of Jail Free Card"
        }

        if (initiator.chanceJailCard) {
            currentTableRow = initiatorSideTable.appendChild(document.createElement("tr"));
            currentTableRow.onclick = tableRowOnClick;

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcheckbox";
            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
            currentTableCellCheckbox.type = "checkbox";
            currentTableCellCheckbox.id = "tradeleftcheckbox41";
            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcolor";
            currentTableCell.style.backgroundColor = "white";
            currentTableCell.style.borderColor = "grey";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellname";

            currentTableCell.textContent = "Get Out of Jail Free Card"
        } else if (recipient.chanceJailCard) {
            currentTableRow = recipientSideTable.appendChild(document.createElement("tr"));
            currentTableRow.onclick = tableRowOnClick;

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcheckbox";
            currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
            currentTableCellCheckbox.type = "checkbox";
            currentTableCellCheckbox.id = "traderightcheckbox41";
            currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellcolor";
            currentTableCell.style.backgroundColor = "white";
            currentTableCell.style.borderColor = "grey";

            currentTableCell = currentTableRow.appendChild(document.createElement("td"));
            currentTableCell.className = "propertycellname";

            currentTableCell.textContent = "Get Out of Jail Free Card"
        }

        if (initiatorSideTable.lastChild) {
            initiatorProperty.appendChild(initiatorSideTable)
        } else {
            initiatorProperty.textContent = initiator.name + " has no properties to trade."
        }

        if (recipientSideTable.lastChild) {
            recipientProperty.appendChild(recipientSideTable)
        } else {
            recipientProperty.textContent = recipient.name + " has no properties to trade."
        }

        document.getElementById("trade-leftp-name").textContent = initiator.name;

        currentName = document.getElementById("trade-rightp-name");

        if (allowRecipientToBeChanged && pcount > 2) {
            // Empty element.
            while (currentName.lastChild) {
                currentName.removeChild(currentName.lastChild)
            }

            nameSelect = currentName.appendChild(document.createElement("select"));
            for (let i = 1; i <= pcount; i++) {
                if (i === initiator.index) {
                    continue
                }

                currentOption = nameSelect.appendChild(document.createElement("option"));
                currentOption.value = i + "";
                currentOption.style.color = player[i].color;
                currentOption.textContent = player[i].name;

                if (i === recipient.index) {
                    currentOption.selected = "selected"
                }
            }

            nameSelect.onchange = function () {
                resetTrade(currentInitiator, player[parseInt(this.value, 10)], true)
            };

            nameSelect.title = "Select a player to trade with."
        } else {
            currentName.textContent = recipient.name
        }

        document.getElementById("trade-leftp-money").value = "0";
        document.getElementById("trade-rightp-money").value = "0"

    };
    /**
     * Считать сделку
     *
     * Функция, которая считывает сделку
     *
     * @returns {Trade}
     */
    let readTrade = function () {
        let initiator = currentInitiator;
        let recipient = currentRecipient;
        let property = new Array(40);
        let money;
        let communityChestJailCard;
        let chanceJailCard;

        for (let i = 0; i < 40; i++) {

            if (document.getElementById("tradeleftcheckbox" + i) && document.getElementById("tradeleftcheckbox" + i).checked) {
                property[i] = 1
            } else if (document.getElementById("traderightcheckbox" + i) && document.getElementById("traderightcheckbox" + i).checked) {
                property[i] = -1
            } else {
                property[i] = 0
            }
        }

        if (document.getElementById("tradeleftcheckbox40") && document.getElementById("tradeleftcheckbox40").checked) {
            communityChestJailCard = 1
        } else if (document.getElementById("traderightcheckbox40") && document.getElementById("traderightcheckbox40").checked) {
            communityChestJailCard = -1
        } else {
            communityChestJailCard = 0
        }

        if (document.getElementById("tradeleftcheckbox41") && document.getElementById("tradeleftcheckbox41").checked) {
            chanceJailCard = 1
        } else if (document.getElementById("traderightcheckbox41") && document.getElementById("traderightcheckbox41").checked) {
            chanceJailCard = -1
        } else {
            chanceJailCard = 0
        }

        money = parseInt(document.getElementById("trade-leftp-money").value, 10) || 0;
        money -= parseInt(document.getElementById("trade-rightp-money").value, 10) || 0;

        return new Trade(initiator, recipient, money, property, communityChestJailCard, chanceJailCard)
    };
    /**
     * Вывести сделку
     *
     * Функция, которая выводит сделку
     *
     * @param {Trade} tradeObj
     */
    let writeTrade = function (tradeObj) {
        resetTrade(tradeObj.getInitiator(), tradeObj.getRecipient(), false);

        for (let i = 0; i < 40; i++) {

            if (document.getElementById("tradeleftcheckbox" + i)) {

                document.getElementById("tradeleftcheckbox" + i).checked = tradeObj.getProperty(i) === 1;
            }

            if (document.getElementById("traderightcheckbox" + i)) {

                document.getElementById("traderightcheckbox" + i).checked = tradeObj.getProperty(i) === -1;
            }
        }

        if (document.getElementById("tradeleftcheckbox40")) {
            document.getElementById("tradeleftcheckbox40").checked = tradeObj.getCommunityChestJailCard() === 1;
        }

        if (document.getElementById("traderightcheckbox40")) {
            document.getElementById("traderightcheckbox40").checked = tradeObj.getCommunityChestJailCard() === -1;
        }

        if (document.getElementById("tradeleftcheckbox41")) {
            document.getElementById("tradeleftcheckbox41").checked = tradeObj.getchanceJailCard() === 1;
        }

        if (document.getElementById("traderightcheckbox41")) {
            document.getElementById("traderightcheckbox41").checked = tradeObj.getchanceJailCard() === -1;
        }

        if (tradeObj.getMoney() > 0) {
            document.getElementById("trade-leftp-money").value = tradeObj.getMoney() + ""
        } else {
            document.getElementById("trade-rightp-money").value = (-tradeObj.getMoney()) + ""
        }

    };
    /**
     * Начать сделку
     *
     * Начинает сделку (обертка)
     *
     * @param {Trade} tradeObj
     */
    this.trade = function (tradeObj) {
        $("#board").hide();
        $("#control").hide();
        $("#trade").show();
        $("#proposetradebutton").show();
        $("#canceltradebutton").show();
        $("#accepttradebutton").hide();
        $("#rejecttradebutton").hide();

        if (tradeObj instanceof Trade) {
            writeTrade(tradeObj);
            this.proposeTrade()
        } else {
            let initiator = player[turn];
            let recipient = turn === 1 ? player[2] : player[1];

            currentInitiator = initiator;
            currentRecipient = recipient;

            resetTrade(initiator, recipient, true)
        }
    };

    /**
     * Завершить сделку
     *
     * Завершает сделку (обертка)
     */
    this.cancelTrade = function () {
        $("#board").show();
        $("#control").show();
        $("#trade").hide();


        if (!player[turn].human) {
            player[turn].AI.alertList = "";
            game.next()
        }

    };
    /**
     * Подтвердить сделку
     *
     * Подтверждает сделку (обертка)
     *
     * @param tradeObj
     * @returns {boolean} true, если подтверждена сделка
     */
    this.acceptTrade = function (tradeObj) {
        if (isNaN(document.getElementById("trade-leftp-money").value)) {
            document.getElementById("trade-leftp-money").value = "This value must be a number.";
            document.getElementById("trade-leftp-money").style.color = "red";
            return false
        }

        if (isNaN(document.getElementById("trade-rightp-money").value)) {
            document.getElementById("trade-rightp-money").value = "This value must be a number.";
            document.getElementById("trade-rightp-money").style.color = "red";
            return false
        }

        let showAlerts = true;
        let money;
        let initiator;
        let recipient;

        if (tradeObj) {
            showAlerts = false
        } else {
            tradeObj = readTrade()
        }

        money = tradeObj.getMoney();
        initiator = tradeObj.getInitiator();
        recipient = tradeObj.getRecipient();


        if (money > 0 && money > initiator.money) {
            document.getElementById("trade-leftp-money").value = initiator.name + " does not have $" + money + ".";
            document.getElementById("trade-leftp-money").style.color = "red";
            return false
        } else if (money < 0 && -money > recipient.money) {
            document.getElementById("trade-rightp-money").value = recipient.name + " does not have $" + (-money) + ".";
            document.getElementById("trade-rightp-money").style.color = "red";
            return false
        }

        let isAPropertySelected = 0;

        // Ensure that some properties are selected.
        for (let i = 0; i < 40; i++) {
            isAPropertySelected |= tradeObj.getProperty(i)
        }

        isAPropertySelected |= tradeObj.getCommunityChestJailCard();
        isAPropertySelected |= tradeObj.getchanceJailCard();

        if (isAPropertySelected === 0) {
            popup("<p>One or more properties must be selected in order to trade.</p>");

            return false
        }

        if (showAlerts && !confirm(initiator.name + ", are you sure you want to make this exchange with " + recipient.name + "?")) {
            return false
        }

        // Exchange properties
        for (let i = 0; i < 40; i++) {

            if (tradeObj.getProperty(i) === 1) {
                square[i].owner = recipient.index;
                addAlert(recipient.name + " received " + square[i].name + " from " + initiator.name + ".")
            } else if (tradeObj.getProperty(i) === -1) {
                square[i].owner = initiator.index;
                addAlert(initiator.name + " received " + square[i].name + " from " + recipient.name + ".")
            }

        }

        if (tradeObj.getCommunityChestJailCard() === 1) {
            initiator.communityChestJailCard = false;
            recipient.communityChestJailCard = true;
            addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".")
        } else if (tradeObj.getCommunityChestJailCard() === -1) {
            initiator.communityChestJailCard = true;
            recipient.communityChestJailCard = false;
            addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".")
        }

        if (tradeObj.getchanceJailCard() === 1) {
            initiator.chanceJailCard = false;
            recipient.chanceJailCard = true;
            addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".")
        } else if (tradeObj.getchanceJailCard() === -1) {
            initiator.chanceJailCard = true;
            recipient.chanceJailCard = false;
            addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".")
        }

        // Exchange money.
        if (money > 0) {
            initiator.pay(money, recipient.index);
            recipient.money += money;

            addAlert(recipient.name + " received $" + money + " from " + initiator.name + ".")
        } else if (money < 0) {
            money = -money;

            recipient.pay(money, initiator.index);
            initiator.money += money;

            addAlert(initiator.name + " received $" + money + " from " + recipient.name + ".")
        }

        updateOwned();
        updateMoney();

        $("#board").show();
        $("#control").show();
        $("#trade").hide();

        if (!player[turn].human) {
            player[turn].AI.alertList = "";
            game.next()
        }
    };
    /**
     * Предложить сделку
     *
     * Предлагает сделку (обертка)
     *
     * @returns {boolean} true, если получилось предложить сделку
     */
    this.proposeTrade = function () {
        if (isNaN(document.getElementById("trade-leftp-money").value)) {
            document.getElementById("trade-leftp-money").value = "This value must be a number.";
            document.getElementById("trade-leftp-money").style.color = "red";
            return false
        }

        if (isNaN(document.getElementById("trade-rightp-money").value)) {
            document.getElementById("trade-rightp-money").value = "This value must be a number.";
            document.getElementById("trade-rightp-money").style.color = "red";
            return false
        }

        let tradeObj = readTrade();
        let money = tradeObj.getMoney();
        let initiator = tradeObj.getInitiator();
        let recipient = tradeObj.getRecipient();
        let reversedTradeProperty = [];

        if (money > 0 && money > initiator.money) {
            document.getElementById("trade-leftp-money").value = initiator.name + " does not have $" + money + ".";
            document.getElementById("trade-leftp-money").style.color = "red";
            return false
        } else if (money < 0 && -money > recipient.money) {
            document.getElementById("trade-rightp-money").value = recipient.name + " does not have $" + (-money) + ".";
            document.getElementById("trade-rightp-money").style.color = "red";
            return false
        }

        let isAPropertySelected = 0;

        // Ensure that some properties are selected.
        for (let i = 0; i < 40; i++) {
            reversedTradeProperty[i] = -tradeObj.getProperty(i);
            isAPropertySelected |= tradeObj.getProperty(i)
        }

        isAPropertySelected |= tradeObj.getCommunityChestJailCard();
        isAPropertySelected |= tradeObj.getchanceJailCard();

        if (isAPropertySelected === 0) {
            popup("<p>One or more properties must be selected in order to trade.</p>");

            return false
        }

        if (initiator.human && !confirm(initiator.name + ", are you sure you want to make this offer to " + recipient.name + "?")) {
            return false
        }

        let reversedTrade = new Trade(recipient, initiator, -money, reversedTradeProperty, -tradeObj.getCommunityChestJailCard(), -tradeObj.getchanceJailCard());

        if (recipient.human) {

            writeTrade(reversedTrade);

            $("#proposetradebutton").hide();
            $("#canceltradebutton").hide();
            $("#accepttradebutton").show();
            $("#rejecttradebutton").show();

            addAlert(initiator.name + " initiated a trade with " + recipient.name + ".");
            popup("<p>" + initiator.name + " has proposed a trade with you, " + recipient.name + ". You may accept, reject, or modify the offer.</p>")
        } else {
            let tradeResponse = recipient.AI.acceptTrade(tradeObj);

            if (tradeResponse === true) {
                popup("<p>" + recipient.name + " has accepted your offer.</p>");
                this.acceptTrade(reversedTrade)
            } else if (tradeResponse === false) {
                popup("<p>" + recipient.name + " has declined your offer.</p>");

            } else if (tradeResponse instanceof Trade) {
                popup("<p>" + recipient.name + " has proposed a counteroffer.</p>");
                writeTrade(tradeResponse);

                $("#proposetradebutton, #canceltradebutton").hide();
                $("#accepttradebutton").show();
                $("#rejecttradebutton").show()
            }
        }
    };


// Bankrupcy functions:

    /**
     * Исключить игрока
     *
     * Исключает игрока
     */
    this.eliminatePlayer = function () {
        let p = player[turn];

        for (let i = p.index; i < pcount; i++) {
            player[i] = player[i + 1];
            player[i].index = i

        }

        for (let i = 0; i < 40; i++) {
            if (square[i].owner >= p.index) {
                square[i].owner--
            }
        }

        pcount--;
        turn--;

        if (pcount === 2) {
            document.getElementById("stats").style.width = "454px"
        } else if (pcount === 3) {
            document.getElementById("stats").style.width = "686px"
        }

        if (pcount === 1) {
            updateMoney();
            $("#control").hide();
            $("#board").hide();
            $("#refresh").show();

            // // Display land counts for survey purposes.
            // let text
            // for (let i = 0 i < 40 i++) {
            // if (i === 0)
            // text = square[i].landcount
            // else
            // text += " " + square[i].landcount
            // }
            // document.getElementById("refresh").innerHTML += "<br><br><div><textarea type='text' style='width: 980px' onclick='javascript:select()' />" + text + "</textarea></div>"

            popup("<p>Congratulations, " + player[1].name + ", you have won the game.</p><div>")

        } else {
            play()
        }
    };
    /**
     * Заложить собственность в связи с банкротством
     *
     * Когда у игрока заканчиваются деньги, вызывается функция
     */
    this.bankruptcyUnmortgage = function () {
        let p = player[turn];

        if (p.creditor === 0) {
            this.eliminatePlayer();
            return
        }

        let html = "<p>" + player[p.creditor].name + ", you may unmortgage any of the following properties, interest free, by clicking on them. Click OK when finished.</p><table>";
        let price;

        for (let i = 0; i < 40; i++) {
            sq = square[i];
            if (sq.owner === p.index && sq.mortgage) {
                price = Math.round(sq.price * 0.5);

                html += "<tr><td class='propertycellcolor' style='background: " + sq.color + "";

                if (sq.groupNumber === 1 || sq.groupNumber === 2) {
                    html += " border: 1px solid grey"
                } else {
                    html += " border: 1px solid " + sq.color + ""
                }

                // Player already paid interest, so they can unmortgage for the mortgage price.
                html += "' onmouseover='showdeed(" + i + ")' onmouseout='hidedeed()'></td><td class='propertycellname'><a href='javascript:void(0)' title='Unmortgage " + sq.name + " for $" + price + ".' onclick='if (" + price + " <= player[" + p.creditor + "].money) {player[" + p.creditor + "].pay(" + price + ", 0) square[" + i + "].mortgage = false addAlert(\"" + player[p.creditor].name + " unmortgaged " + sq.name + " for $" + price + ".\")} this.parentElement.parentElement.style.display = \"none\"'>Unmortgage " + sq.name + " ($" + price + ")</a></td></tr>";

                sq.owner = p.creditor

            }
        }

        html += "</table>";

        popup(html, game.eliminatePlayer)
    };
    /**
     * Переназначить
     *
     * Выводит диалоговое окно
     */
    this.resign = function () {
        popup("<p>Are you sure you want to resign?</p>", game.bankruptcy, "Yes/No")
    };
    /**
     * Банкротство
     *
     * Проверяет на банкротство
     */
    this.bankruptcy = function () {
        let p = player[turn];
        let pcredit = player[p.creditor];
        let bankruptcyUnmortgageFee = 0;


        if (p.money >= 0) {
            return
        }

        addAlert(p.name + " is bankrupt.");

        if (p.creditor !== 0) {
            pcredit.money += p.money
        }

        for (let i = 0; i < 40; i++) {
            sq = square[i];
            if (sq.owner === p.index) {
                // Mortgaged properties will be tranfered by bankruptcyUnmortgage()
                if (!sq.mortgage) {
                    sq.owner = p.creditor
                } else {
                    bankruptcyUnmortgageFee += Math.round(sq.price * 0.1)
                }

                if (sq.house > 0) {
                    if (p.creditor !== 0) {
                        pcredit.money += sq.housePrice * 0.5 * sq.house
                    }
                    sq.hotel = 0;
                    sq.house = 0
                }

                if (p.creditor === 0) {
                    sq.mortgage = false;
                    game.addPropertyToAuctionQueue(i);
                    sq.owner = 0
                }
            }
        }

        updateMoney();

        if (p.chanceJailCard) {
            p.chanceJailCard = false;
            pcredit.chanceJailCard = true
        }

        if (p.communityChestJailCard) {
            p.communityChestJailCard = false;
            pcredit.communityChestJailCard = true
        }

        if (pcount === 2 || bankruptcyUnmortgageFee === 0 || p.creditor === 0) {
            this.eliminatePlayer()
        } else {
            addAlert(pcredit.name + " paid $" + bankruptcyUnmortgageFee + " interest on the mortgaged properties received from " + p.name + ".");
            popup("<p>" + pcredit.name + ", you must pay $" + bankruptcyUnmortgageFee + " interest on the mortgaged properties you received from " + p.name + ".</p>", function () {
                player[pcredit.index].pay(bankruptcyUnmortgageFee, 0);
                game.bankruptcyUnmortgage()
            })
        }
    }
}

let game;

/**
 * Игрок
 *
 * Класс описывает абстрактного игрока,
 * который принимает участие в партии.
 *
 * @author virvira
 * @version 0.0.1
 * @copyright GNU Public License
 */
function Player(name, color) {
    /**
     * Имя игрока
     *
     * Используем только простое символьное
     * имя игрока. Если будет
     * необходима детализация, создадим
     * класс Name
     *
     * @var {string} name
     */
    this.name = name;
    /**
     * Цвет полей игрока
     *
     * Используем только простое символьное
     * название цвета. Если будет
     * необходима детализация, создадим
     * класс Color
     *
     * @var {string} color
     */
    this.color = color;
    /**
     * Позиция игрока
     *
     * Используем только целочисленное обозначение
     * позиции. Если будет
     * необходима детализация, создадим
     * класс Position
     *
     * @var {number} position
     */
    this.position = 0;
    /**
     * Деньги игрока
     *
     * Используем целочисленное обозначение
     * количества денег, имеющихся у игрока.
     * Если будет
     * необходима детализация, создадим
     * класс Money
     *
     * @var {number} money
     */
    this.money = 1500;
    /**
     * Кредиторы игрока
     *
     * Используем целочисленное обозначение
     * количества кредиторов игрока. Если будет
     * необходима детализация, создадим
     * класс Creditor
     *
     * @var {string} creditor
     */
    this.creditor = -1;
    /**
     * Тюремное заключение
     *
     * Используем логическую переменную
     * для обозначения свободы игрока. Если будет
     * необходима детализация, создадим
     * класс Jail
     *
     * @var {boolean} jail
     */
    this.jail = false;
    /**
     * Поле с тюрьмой
     *
     * Используем целочисленное обозначение
     * для номера поля с тюрьмой. Если будет
     * необходима детализация, создадим
     * класс Jailroll
     *
     * @var {number} jailroll
     */
    this.jailroll = 0;
    /**
     * Общественное тюремное заключение
     *
     * Используем логическое обозначение для
     * того, чтобы узнать, попадал ли игрок
     * на поле общественных работ. Если будет
     * необходима детализация, создадим
     * класс СommunityChestJailCard
     *
     * @var {boolean} communityChestJailCard
     */
    this.communityChestJailCard = false;
    /**
     * Шанс на заключение
     *
     * Используем логическое обозначение для
     * того, чтобы узнать, получает ли игрок
     * тюремное заключение. Если будет
     * необходима детализация, создадим
     * класс СhanceJailCard
     *
     * @var {boolean} chanceJailCard
     */
    this.chanceJailCard = false;
    /**
     * Торги
     *
     * Используем логическое обозначение для
     * того, чтобы узнать, принимает ли игрок
     * участие в торгах. Если будет
     * необходима детализация, создадим
     * класс Bidding
     *
     * @var {boolean} bidding
     */
    this.bidding = true;
    /**
     * Человек
     *
     * Используем логическое обозначение для
     * того, чтобы узнать, является ли игрок
     * человеком. Если будет
     * необходима детализация, создадим
     * класс Human
     *
     * @var {boolean} human
     */
    this.human = true;
    // this.AI = null

    /**
     * Работа со свойством
     *
     * Если сумма запроса на кредит меньше, чем
     * количество денег у кредитора, возвращается значение
     * true. Если больше, - false.
     *
     * @param {string} amount
     * @param {string} creditor
     * @return {boolean} pay Возвращает логическую переменную платежа
     */
    this.pay = function (amount, creditor) {
        if (amount <= this.money) {
            this.money -= amount;

            updateMoney();

            return true
        } else {
            this.money -= amount;
            this.creditor = creditor;

            updateMoney();

            return false
        }
    }
}

/**
 * Сделка
 *
 * Класс описывает абстрактную сделку,
 * которая может произойти в игре.
 *
 * @author virvira
 * @version 0.0.1
 * @copyright GNU Public License
 */
function Trade(initiator, recipient, money, property, communityChestJailCard, chanceJailCard) {

    /**
     * Работа со свойством
     *
     * Метод для получения значения свойства initiator
     *
     * @return {string} initiator Возвращает текущее значение
     *                   свойства или указатель на
     *                   объект
     */
    this.getInitiator = function () {
        return initiator
    };
    /**
     * Работа со свойством
     *
     * Метод для получения значения свойства recipient
     *
     * @return {string} recipient Возвращает текущее значение
     *                            свойства или указатель на
     *                            объект
     */
    this.getRecipient = function () {
        return recipient
    };
    /**
     * Работа со свойством
     *
     * Метод для получения значения свойства property
     *
     * @param {number} index
     * @return {string} property[index] Возвращает элемент массива
     *                                  номером index
     */
    this.getProperty = function (index) {
        return property[index]
    };
    /**
     * Работа со свойством {@link money}
     *
     * Метод для получения значения свойства money
     *
     * @return {number} money Возвращает текущее значение
     *                        свойства или указатель на
     *                        объект
     */
    this.getMoney = function () {
        return money
    };
    /**
     * Работа со свойством
     *
     * Метод для получения значения свойства communityChestJailCard
     *
     * @return {boolean} communityChestJailCard Возвращает текущее значение
     *                                          свойства или указатель на
     *                                          объект
     */
    this.getCommunityChestJailCard = function () {
        return communityChestJailCard
    };
    /**
     * Работа со свойством
     *
     * Метод для получения значения свойства chanceJailCard
     *
     * @return {boolean} chanceJailCard Возвращает текущее значение
     *                                  свойства или указатель на
     *                                  объект
     */
    this.getchanceJailCard = function () {
        return chanceJailCard
    }
}

/**
 * Набор игроков
 *
 * Используем список типа string
 * для хранения имён игроков.
 *
 * @var {list} player
 */
let player = [];
/**
 * Количество игроков
 *
 * Используем простое целочисленное обозначение
 * для количества игроков.
 *
 * @var {number} pcount
 */
let pcount;
/**
 * Очередь
 *
 * Используем простое целочисленное обозначение
 * для количества игроков в очереди.
 *
 * @var {number} turn
 */
let turn = 0;
/**
 * Удвоенное количество
 *
 * Используем простое целочисленное обозначение
 * для удвоенного количества игроков.
 *
 * @var {number} doublecount
 */
let doublecount = 0;
/**
 * Работа со свойством
 *
 * Массив перезаписывается с номерами от одного
 * до длины массива в случайном порядке.
 *
 * @param {number} length
 * @return {list} Array Возвращается массив
 */
Array.prototype.randomize = function (length) {
    length = (length || this.length);
    /**
     * Номер в массиве
     *
     * Используем простое целочисленное
     * обозначение номера элемента в массиве.
     *
     * @var {number} num
     */
    let num;
    /**
     * Индексы массиа
     *
     * Используем список типа number
     * для хранения индексов массива.
     *
     * @var {list} indexArray
     */
    let indexArray = [];

    for (let i = 0; i < length; i++) {
        indexArray[i] = i
    }

    for (let i = 0; i < length; i++) {
        num = Math.floor(Math.random() * indexArray.length);
        this[i] = indexArray[num] + 1;

        indexArray.splice(num, 1)
    }
};

/**
 * Работа со свойством
 *
 * Добавляет предупреждение для игрока,
 * выводит текст предупреждения.
 *
 * @param {string} alertText
 */
function addAlert(alertText) {
    $alert = $("#alert");

    $(document.createElement("div")).text(alertText).appendTo($alert);

    // Animate scrolling down alert element.
    $alert.stop().animate({"scrollTop": $alert.prop("scrollHeight")}, 1000);

    if (!player[turn].human) {
        player[turn].AI.alertList += "<div>" + alertText + "</div>"
    }
}

/**
 * Работа со свойством
 *
 * Создает привлекательную анимацию
 *
 * @param {string} html
 * @param {string} action
 * @param {string} option
 */
function popup(html, action, option) {
    document.getElementById("popuptext").innerHTML = html;
    document.getElementById("popup").style.width = "300px";
    document.getElementById("popup").style.top = "0px";
    document.getElementById("popup").style.left = "0px";

    if (!option && typeof action === "string") {
        option = action
    }

    option = option ? option.toLowerCase() : "";

    if (typeof action !== "function") {
        action = null
    }

    // blank
    if (option === "blank") {
        // do nothing

        // Yes/No
    } else if (option === "yes/no") {
        document.getElementById("popuptext").innerHTML += "<div><input type=\"button\" value=\"Yes\" id=\"popupyes\" /><input type=\"button\" value=\"No\" id=\"popupno\" /></div>";

        $("#popupyes, #popupno").on("click", function () {
            $("#popupwrap").hide();
            $("#popupbackground").fadeOut(400)
        });

        $("#popupyes").on("click", action)

        // Ok
    } else if (option === "") {
        $("#popuptext").append("<div><input type='button' value='OK' id='popupclose' /></div>");
        $("#popupclose").focus();

        $("#popupclose").on("click", function () {
            $("#popupwrap").hide();
            $("#popupbackground").fadeOut(400)
        }).on("click", action)

        // unknown
    } else {
        alert("unknown popup option '" + option + "'")
    }

    // Show using animation.
    $("#popupbackground").fadeIn(400, function () {
        $("#popupwrap").show()
    })

}

/**
 * Работа со свойством
 *
 * Функция для обновления позиции блока
 *
 */
function updatePosition() {
    // Reset borders
    document.getElementById("jail").style.border = "1px solid black";
    document.getElementById("jailpositionholder").innerHTML = "";
    for (let i = 0; i < 40; i++) {
        document.getElementById("cell" + i).style.border = "1px solid black";
        document.getElementById("cell" + i + "positionholder").innerHTML = ""

    }

    let sq, left, top;

    for (let x = 0; x < 40; x++) {
        sq = square[x];
        left = 0;
        top = 0;

        for (let y = turn; y <= pcount; y++) {

            if (player[y].position === x && !player[y].jail) {

                document.getElementById("cell" + x + "positionholder").innerHTML += "<div class='cell-position' title='" + player[y].name + "' style='background-color: " + player[y].color + " left: " + left + "px top: " + top + "px'></div>";
                if (left === 36) {
                    left = 0;
                    top = 12
                } else
                    left += 12
            }
        }

        for (let y = 1; y < turn; y++) {

            if (player[y].position === x && !player[y].jail) {
                document.getElementById("cell" + x + "positionholder").innerHTML += "<div class='cell-position' title='" + player[y].name + "' style='background-color: " + player[y].color + " left: " + left + "px top: " + top + "px'></div>";
                if (left === 36) {
                    left = 0;
                    top = 12
                } else
                    left += 12
            }
        }
    }

    left = 0;
    top = 53;
    for (let i = turn; i <= pcount; i++) {
        if (player[i].jail) {
            document.getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + player[i].name + "' style='background-color: " + player[i].color + " left: " + left + "px top: " + top + "px'></div>";

            if (left === 36) {
                left = 0;
                top = 41
            } else {
                left += 12
            }
        }
    }

    for (let i = 1; i < turn; i++) {
        if (player[i].jail) {
            document.getElementById("jailpositionholder").innerHTML += "<div class='cell-position' title='" + player[i].name + "' style='background-color: " + player[i].color + " left: " + left + "px top: " + top + "px'></div>";
            if (left === 36) {
                left = 0;
                top = 41
            } else
                left += 12
        }
    }

    p = player[turn];

    if (p.jail) {
        document.getElementById("jail").style.border = "1px solid " + p.color
    } else {
        document.getElementById("cell" + p.position).style.border = "1px solid " + p.color
    }

    // for (let i=1 i <= pcount i++) {
    // document.getElementById("enlarge"+player[i].position+"token").innerHTML+="<img src='"+tokenArray[i].src+"' height='30' width='30' />"
    // }
}

/**
 * Работа со свойством
 *
 * Функция для обновления количества денег
 * у пользователя
 *
 */
function updateMoney() {
    let p = player[turn];

    document.getElementById("pmoney").innerHTML = "$" + p.money;
    $(".money-bar-row").hide();

    for (let i = 1; i <= pcount; i++) {
        p_i = player[i];

        $("#moneybarrow" + i).show();
        document.getElementById("p" + i + "moneybar").style.border = "2px solid " + p_i.color;
        document.getElementById("p" + i + "money").innerHTML = p_i.money;
        document.getElementById("p" + i + "moneyname").innerHTML = p_i.name
    }
    // show("moneybarrow9") // Don't remove this line or make the first for-loop stop when i <= 8, because this affects how the table is displayed.

    if (document.getElementById("landed").innerHTML === "") {
        $("#landed").hide()
    }

    document.getElementById("quickstats").style.borderColor = p.color;

    if (p.money < 0) {
        // document.getElementById("nextbutton").disabled = true
        $("#resignbutton").show();
        $("#nextbutton").hide()
    } else {
        // document.getElementById("nextbutton").disabled = false
        $("#resignbutton").hide();
        $("#nextbutton").show()
    }
}

/**
 * Работа со свойством
 *
 * Функция для обновления цифр на
 * игральной кости
 *
 */
function updateDice() {
    let die0 = game.getDie(true);
    let die1 = game.getDie(false);

    $("#die0").show();
    $("#die1").show();

    if (document.images) {
        let element0 = document.getElementById("die0");
        let element1 = document.getElementById("die1");

        element0.classList.remove("die-no-img");
        element1.classList.remove("die-no-img");

        element0.title = "Die (" + die0 + " spots)";
        element1.title = "Die (" + die1 + " spots)";

        if (element0.firstChild) {
            element0 = element0.firstChild
        } else {
            element0 = element0.appendChild(document.createElement("img"))
        }

        element0.src = "images/Die_" + die0 + ".png";
        element0.alt = die0;

        if (element1.firstChild) {
            element1 = element1.firstChild
        } else {
            element1 = element1.appendChild(document.createElement("img"))
        }

        element1.src = "images/Die_" + die1 + ".png";
        element1.alt = die0
    } else {
        document.getElementById("die0").textContent = die0;
        document.getElementById("die1").textContent = die1;

        document.getElementById("die0").title = "Die";
        document.getElementById("die1").title = "Die"
    }
}

/**
 * Работа со свойством
 *
 * Функция для обновления владений игрока
 *
 */
function updateOwned() {
    let p = player[turn];
    let checkedProperty = getCheckedProperty();
    $("#option").show();
    $("#owned").show();

    let html = "",
        firstProperty = -1;

    let mortgageText = "",
        houseText = "";
    let sq;

    for (let i = 0; i < 40; i++) {
        sq = square[i];
        if (sq.groupNumber && sq.owner === 0) {
            $("#cell" + i + "owner").hide()
        } else if (sq.groupNumber && sq.owner > 0) {
            let currentCellOwner = document.getElementById("cell" + i + "owner");

            currentCellOwner.style.display = "block";
            currentCellOwner.style.backgroundColor = player[sq.owner].color;
            currentCellOwner.title = player[sq.owner].name
        }
    }

    for (let i = 0; i < 40; i++) {
        sq = square[i];
        if (sq.owner === turn) {

            mortgageText = "";
            if (sq.mortgage) {
                mortgageText = "title='Mortgaged' style='color: grey'"
            }

            houseText = "";
            if (sq.house >= 1 && sq.house <= 4) {
                for (let x = 1; x <= sq.house; x++) {
                    houseText += "<img src='images/house.png' alt='' title='House' class='house' />"
                }
            } else if (sq.hotel) {
                houseText += "<img src='images/hotel.png' alt='' title='Hotel' class='hotel' />"
            }

            if (html === "") {
                html += "<table>";
                firstProperty = i
            }

            html += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox" + i + "' /></td><td class='propertycellcolor' style='background: " + sq.color + "";

            if (sq.groupNumber === 1 || sq.groupNumber === 2) {
                html += " border: 1px solid grey width: 18px"
            }

            html += "' onmouseover='showdeed(" + i + ")' onmouseout='hidedeed()'></td><td class='propertycellname' " + mortgageText + ">" + sq.name + houseText + "</td></tr>"
        }
    }

    if (p.communityChestJailCard) {
        if (html === "") {
            firstProperty = 40;
            html += "<table>"
        }
        html += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox40' /></td><td class='propertycellcolor' style='background: white'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>"

    }
    if (p.chanceJailCard) {
        if (html === "") {
            firstProperty = 41;
            html += "<table>"
        }
        html += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox41' /></td><td class='propertycellcolor' style='background: white'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>"
    }

    if (html === "") {
        html = p.name + ", you don't have any properties.";
        $("#option").hide()
    } else {
        html += "</table>"
    }

    document.getElementById("owned").innerHTML = html;

    // Select previously selected property.
    if (checkedProperty > -1 && document.getElementById("propertycheckbox" + checkedProperty)) {
        document.getElementById("propertycheckbox" + checkedProperty).checked = true
    } else if (firstProperty > -1) {
        document.getElementById("propertycheckbox" + firstProperty).checked = true
    }
    $(".property-cell-row").click(function () {
        let row = this;

        // Toggle check the current checkbox.
        $(this).find(".propertycellcheckbox > input").prop("checked", function (index, val) {
            return !val
        });

        // Set all other checkboxes to false.
        $(".propertycellcheckbox > input").prop("checked", function (index, val) {
            if (!$.contains(row, this)) {
                return false
            }
        });

        updateOption()
    });
    updateOption()
}

/**
 * Работа со свойством
 *
 * Функция для обновления настроек игрока
 *
 */
function updateOption() {
    $("#option").show();

    let allGroupUninproved = true;
    let allGroupUnmortgaged = true;
    let checkedProperty = getCheckedProperty();

    if (checkedProperty < 0 || checkedProperty >= 40) {
        $("#buyHouseButton").hide();
        $("#sellHouseButton").hide();
        $("#mortgagebutton").hide();


        let houseSum = 32;
        let hotelSum = 12;

        for (let i = 0; i < 40; i++) {
            s = square[i];
            if (s.hotel === 1)
                hotelSum--;
            else
                houseSum -= s.house
        }

        $("#buildings").show();
        document.getElementById("buildings").innerHTML = "<img src='images/house.png' alt='' title='House' class='house' />:&nbsp" + houseSum + "&nbsp&nbsp<img src='images/hotel.png' alt='' title='Hotel' class='hotel' />:&nbsp" + hotelSum;

        return
    }

    $("#buildings").hide();
    let sq = square[checkedProperty];

    buyHouseButton = document.getElementById("buyHouseButton");
    sellHouseButton = document.getElementById("sellHouseButton");

    $("#mortgagebutton").show();
    document.getElementById("mortgagebutton").disabled = false;

    if (sq.mortgage) {
        document.getElementById("mortgagebutton").value = "Unmortgage ($" + Math.round(sq.price * 0.6) + ")";
        document.getElementById("mortgagebutton").title = "Unmortgage " + sq.name + " for $" + Math.round(sq.price * 0.6) + ".";
        $("#buyHouseButton").hide();
        $("#sellHouseButton").hide();

        allGroupUnmortgaged = false
    } else {
        document.getElementById("mortgagebutton").value = "Mortgage ($" + (sq.price * 0.5) + ")";
        document.getElementById("mortgagebutton").title = "Mortgage " + sq.name + " for $" + (sq.price * 0.5) + ".";

        if (sq.groupNumber >= 3) {
            $("#buyHouseButton").show();
            $("#sellHouseButton").show();
            buyHouseButton.disabled = false;
            sellHouseButton.disabled = false;

            buyHouseButton.value = "Buy house ($" + sq.housePrice + ")";
            sellHouseButton.value = "Sell house ($" + (sq.housePrice * 0.5) + ")";
            buyHouseButton.title = "Buy a house for $" + sq.housePrice;
            sellHouseButton.title = "Sell a house for $" + (sq.housePrice * 0.5);

            if (sq.house === 4) {
                buyHouseButton.value = "Buy hotel ($" + sq.housePrice + ")";
                buyHouseButton.title = "Buy a hotel for $" + sq.housePrice
            }
            if (sq.hotel === 1) {
                $("#buyHouseButton").hide();
                sellHouseButton.value = "Sell hotel ($" + (sq.housePrice * 0.5) + ")";
                sellHouseButton.title = "Sell a hotel for $" + (sq.housePrice * 0.5)
            }

            let maxHouse = 0;
            let minhouse = 5;

            for (let j = 0; j < max; j++) {

                if (square[currentSquare.group[j]].house > 0) {
                    allGroupUninproved = false;
                    break
                }
            }

            let max = sq.group.length;
            for (let i = 0; i < max; i++) {
                s = square[sq.group[i]];

                if (s.owner !== sq.owner) {
                    buyHouseButton.disabled = true;
                    sellHouseButton.disabled = true;
                    buyHouseButton.title = "Before you can buy a house, you must own all the properties of this color-group."
                } else {

                    if (s.house > maxHouse) {
                        maxHouse = s.house
                    }

                    if (s.house < minhouse) {
                        minhouse = s.house
                    }

                    if (s.house > 0) {
                        allGroupUninproved = false
                    }

                    if (s.mortgage) {
                        allGroupUnmortgaged = false
                    }
                }
            }

            if (!allGroupUnmortgaged) {
                buyHouseButton.disabled = true;
                buyHouseButton.title = "Before you can buy a house, you must unmortgage all the properties of this color-group."
            }

            // Force even building
            if (sq.house > minhouse) {
                buyHouseButton.disabled = true;

                if (sq.house === 1) {
                    buyHouseButton.title = "Before you can buy another house, the other properties of this color-group must all have one house."
                } else if (sq.house === 4) {
                    buyHouseButton.title = "Before you can buy a hotel, the other properties of this color-group must all have 4 houses."
                } else {
                    buyHouseButton.title = "Before you can buy a house, the other properties of this color-group must all have " + sq.house + " houses."
                }
            }
            if (sq.house < maxHouse) {
                sellHouseButton.disabled = true;

                if (sq.house === 1) {
                    sellHouseButton.title = "Before you can sell house, the other properties of this color-group must all have one house."
                } else {
                    sellHouseButton.title = "Before you can sell a house, the other properties of this color-group must all have " + sq.house + " houses."
                }
            }

            if (sq.house === 0 && sq.hotel === 0) {
                $("#sellHouseButton").hide()

            } else {
                $("#mortgagebutton").hide()

            }

            // Before a property can be mortgaged or sold, all the properties of its color-group must unimproved.
            if (!allGroupUninproved) {
                document.getElementById("mortgagebutton").title = "Before a property can be mortgaged, all the properties of its color-group must unimproved.";
                document.getElementById("mortgagebutton").disabled = true
            }

        } else {
            $("#buyHouseButton").hide();
            $("#sellHouseButton").hide()
        }
    }
}

/**
 * Работа со свойством
 *
 * Функция, которая даёт шанс игроку
 * попасть на поле Общественного фонда
 *
 */
function chanceCommunityChest() {
    let p = player[turn];

    // Community Chest
    if (p.position === 2 || p.position === 17 || p.position === 33) {
        let communityChestIndex = communityChestCards.deck[communityChestCards.index];

        // Remove the get out of jail free card from the deck.
        if (communityChestIndex === 0) {
            communityChestCards.deck.splice(communityChestCards.index, 1)
        }

        popup("<img src='images/community_chest_icon.png' style='height: 50px width: 53px float: left margin: 8px 8px 8px 0px' /><div style='font-weight: bold font-size: 16px '>Community Chest:</div><div style='text-align: justify'>" + communityChestCards[communityChestIndex].text + "</div>", function () {
            communityChestAction(communityChestIndex)
        });

        communityChestCards.index++;

        if (communityChestCards.index >= communityChestCards.deck.length) {
            communityChestCards.index = 0
        }

        // Chance
    } else if (p.position === 7 || p.position === 22 || p.position === 36) {
        let chanceIndex = chanceCards.deck[chanceCards.index];

        // Remove the get out of jail free card from the deck.
        if (chanceIndex === 0) {
            chanceCards.deck.splice(chanceCards.index, 1)
        }

        popup("<img src='images/chance_icon.png' style='height: 50px width: 26px float: left margin: 8px 8px 8px 0px' /><div style='font-weight: bold font-size: 16px '>Chance:</div><div style='text-align: justify'>" + chanceCards[chanceIndex].text + "</div>", function () {
            chanceAction(chanceIndex)
        });

        chanceCards.index++;

        if (chanceCards.index >= chanceCards.deck.length) {
            chanceCards.index = 0
        }
    } else {
        if (!p.human) {
            p.AI.alertList = "";

            if (!p.AI.onLand()) {
                game.next()
            }
        }
    }
}

/**
 * Работа со свойством
 *
 * Функция, которая рассчитывает шансы
 * игрока на совершение действия
 *
 * @param {number} chanceIndex
 */
function chanceAction(chanceIndex) {
    let p = player[turn]; // This is needed for reference in action() method.

    // $('#popupbackground').hide()
    // $('#popupwrap').hide()
    chanceCards[chanceIndex].action(p);

    updateMoney();

    if (chanceIndex !== 15 && !p.human) {
        p.AI.alertList = "";
        game.next()
    }
}

/**
 * Работа со свойством
 *
 * Функция, которая рассчитывает шансы
 * игрока попасть на поле Общественного фонда
 *
 * @param {number} communityChestIndex
 */
function communityChestAction(communityChestIndex) {
    let p = player[turn]; // This is needed for reference in action() method.

    // $('#popupbackground').hide()
    // $('#popupwrap').hide()
    communityChestCards[communityChestIndex].action(p);

    updateMoney();

    if (communityChestIndex !== 15 && !p.human) {
        p.AI.alertList = "";
        game.next()
    }
}

/**
 * Работа со свойством
 *
 * Функция для добавления денег
 * игроку по какой-либо причине.
 *
 * @param {number} amount
 * @param {string} cause
 */
function addAmount(amount, cause) {
    let p = player[turn];

    p.money += amount;

    addAlert(p.name + " received $" + amount + " from " + cause + ".")
}

/**
 * Работа со свойством
 *
 * Функция для вычитания денег
 * у игрока по какой-либо причине.
 *
 * @param {number} amount
 * @param {string} cause
 */
function subtractAmount(amount, cause) {
    let p = player[turn];

    p.pay(amount, 0);

    addAlert(p.name + " lost $" + amount + " from " + cause + ".")
}

/**
 * Работа со свойством
 *
 * Функция для отправки пользователя
 * в тюрьму
 *
 */
function gotoJail() {
    let p = player[turn];
    addAlert(p.name + " was sent directly to jail.");
    document.getElementById("landed").innerHTML = "You are in jail.";

    p.jail = true;
    doublecount = 0;

    document.getElementById("nextbutton").value = "End turn";
    document.getElementById("nextbutton").title = "End turn and advance to the next player.";

    if (p.human) {
        document.getElementById("nextbutton").focus()
    }

    updatePosition();
    updateOwned();

    if (!p.human) {
        popup(p.AI.alertList, game.next);
        p.AI.alertList = ""
    }
}

/**
 * Назад на 3 хода
 */
function goBackThreeSpaces() {
    let p = player[turn];

    p.position -= 3;

    land();
}

/**
 * Заплатить каждому игроку сумму
 * @param {int} amount - Сумма
 * @param {string} cause - Причина
 */
function payEachPlayer(amount, cause) {
    let p = player[turn];
    let total = 0;

    for (let i = 1; i <= pcount; i++) {
        if (i !== turn) {
            player[i].money += amount;
            total += amount;
            creditor = p.money >= 0 ? i : creditor;

            p.pay(amount, creditor)
        }
    }

    addAlert(p.name + " lost $" + total + " from " + cause + ".")
}

/**
 * Списать со счёта всех игроков сумму
 * @param {int} amount - Сумма
 * @param {string} cause - Причина
 */
function collectfromeachplayer(amount, cause) {
    let p = player[turn];
    let total = 0;

    for (let i = 1; i <= pcount; i++) {
        if (i !== turn) {
            money = player[i].money;
            if (money < amount) {
                p.money += money;
                total += money;
                player[i].money = 0
            } else {
                player[i].pay(amount, turn);
                p.money += amount;
                total += amount
            }
        }
    }

    addAlert(p.name + " received $" + total + " from " + cause + ".")
}

/**
 * Переместить
 * @param {int} destination - Точка назначения
 * @param {int} pass - Количество клеток пройденного пути
 */
function advance(destination, pass) {
    let p = player[turn];

    if (typeof pass === "number") {
        if (p.position < pass) {
            p.position = pass
        } else {
            p.position = pass;
            p.money += 200;
            addAlert(p.name + " collected a $200 salary for passing GO.")
        }
    }
    if (p.position < destination) {
        p.position = destination
    } else {
        p.position = destination;
        p.money += 200;
        addAlert(p.name + " collected a $200 salary for passing GO.")
    }

    land()
}

/**
 * Продвижение к ближайшей утилите!
 */
function advanceToNearestUtility() {
    let p = player[turn];

    if (p.position < 12) {
        p.position = 12
    } else if (p.position >= 12 && p.position < 28) {
        p.position = 28
    } else if (p.position >= 28) {
        p.position = 12;
        p.money += 200;
        addAlert(p.name + " collected a $200 salary for passing GO.")
    }

    land(true)
}

/**
 * Продвижение к железной дороге
 */
function advanceToNearestRailRoad() {
    let p = player[turn];

    updatePosition();

    if (p.position < 15) {
        p.position = 15
    } else if (p.position >= 15 && p.position < 25) {
        p.position = 25
    } else if (p.position >= 35) {
        p.position = 5;
        p.money += 200;
        addAlert(p.name + " collected a $200 salary for passing GO.")
    }

    land(true)
}

/**
 * Расходы в общественный фонд
 * @param {int} housePrice
 * @param {int} hotelprice
 */
function streetRepairs(housePrice, hotelprice) {
    let cost = 0;
    for (let i = 0; i < 40; i++) {
        let s = square[i];
        if (s.owner === turn) {
            if (s.hotel === 1)
                cost += hotelprice;
            else
                cost += s.house * housePrice
        }
    }

    let p = player[turn];

    if (cost > 0) {
        p.pay(cost, 0);

        // If function was called by Community Chest.
        if (housePrice === 40) {
            addAlert(p.name + " lost $" + cost + " to Community Chest.")
        } else {
            addAlert(p.name + " lost $" + cost + " to Chance.")
        }
    }

}

/**
 * Заплатить 50 долларов, чтобы выйти из тюрьмы
 */
function payfifty() {
    let p = player[turn];

    document.getElementById("jail").style.border = '1px solid black';
    document.getElementById("cell11").style.border = '2px solid ' + p.color;

    $("#landed").hide();
    doublecount = 0;

    p.jail = false;
    p.jailroll = 0;
    p.position = 10;
    p.pay(50, 0);

    addAlert(p.name + " paid the $50 fine to get out of jail.");
    updateMoney();
    updatePosition()
}

/**
 * Выйти из тюрьмы
 */
function useJailCard() {
    let p = player[turn];

    document.getElementById("jail").style.border = '1px solid black';
    document.getElementById("cell11").style.border = '2px solid ' + p.color;

    $("#landed").hide();
    p.jail = false;
    p.jailroll = 0;

    p.position = 10;

    doublecount = 0;

    if (p.communityChestJailCard) {
        p.communityChestJailCard = false;

        // Insert the get out of jail free card back into the community chest deck.
        communityChestCards.deck.splice(communityChestCards.index, 0, 0);

        communityChestCards.index++;

        if (communityChestCards.index >= communityChestCards.deck.length) {
            communityChestCards.index = 0
        }
    } else if (p.chanceJailCard) {
        p.chanceJailCard = false;

        // Insert the get out of jail free card back into the chance deck.
        chanceCards.deck.splice(chanceCards.index, 0, 0);

        chanceCards.index++;

        if (chanceCards.index >= chanceCards.deck.length) {
            chanceCards.index = 0
        }
    }

    addAlert(p.name + " used a \"Get Out of Jail Free\" card.");
    updateOwned();
    updatePosition()
}

/**
 * Купить имущество
 * @param {int} index - Номер клетки
 * @return {boolean} Возвращает состояние покупки
 */
function buyHouse(index) {
    let sq = square[index];
    let p = player[sq.owner];
    let houseSum = 0;
    let hotelSum = 0;

    if (p.money - sq.housePrice < 0) {
        if (sq.house === 4) {
            return false
        } else {
            return false
        }

    } else {
        for (let i = 0; i < 40; i++) {
            if (square[i].hotel === 1) {
                hotelSum++
            } else {
                houseSum += square[i].house
            }
        }

        if (sq.house < 4) {
            if (houseSum >= 32) {
                return false

            } else {
                sq.house++;
                addAlert(p.name + " placed a house on " + sq.name + ".")
            }

        } else {
            if (hotelSum >= 12) {
                return

            } else {
                sq.house = 5;
                sq.hotel = 1;
                addAlert(p.name + " placed a hotel on " + sq.name + ".")
            }
        }

        p.pay(sq.housePrice, 0);

        updateOwned();
        updateMoney()
    }
}

/**
 * Продажа имущества
 * @param {int} index
 */
function sellHouse(index) {
    let sq = square[index];
    let p = player[sq.owner];

    if (sq.hotel === 1) {
        sq.hotel = 0;
        sq.house = 4;
        addAlert(p.name + " sold the hotel on " + sq.name + ".")
    } else {
        sq.house--;
        addAlert(p.name + " sold a house on " + sq.name + ".")
    }

    p.money += sq.housePrice * 0.5;
    updateOwned();
    updateMoney()
}

/**
 * Показать статистику
 */
function showStats() {
    let html, sq, p;
    let mortgageText,
        houseText;
    let write;
    html = "<table align='center'><tr>";

    for (let x = 1; x <= pcount; x++) {
        write = false;
        p = player[x];
        if (x === 5) {
            html += "</tr><tr>"
        }
        html += "<td class='statscell' id='statscell" + x + "' style='border: 2px solid " + p.color + "' ><div class='statsplayername'>" + p.name + "</div>";

        for (let i = 0; i < 40; i++) {
            sq = square[i];

            if (sq.owner === x) {
                mortgageText = "",
                    houseText = "";

                if (sq.mortgage) {
                    mortgageText = "title='Mortgaged' style='color: grey'"
                }

                if (!write) {
                    write = true;
                    html += "<table>"
                }

                if (sq.house === 5) {
                    houseText += "<span style='float: right font-weight: bold'>1&nbspx&nbsp<img src='images/hotel.png' alt='' title='Hotel' class='hotel' style='float: none' /></span>"
                } else if (sq.house > 0 && sq.house < 5) {
                    houseText += "<span style='float: right font-weight: bold'>" + sq.house + "&nbspx&nbsp<img src='images/house.png' alt='' title='House' class='house' style='float: none' /></span>"
                }

                html += "<tr><td class='statscellcolor' style='background: " + sq.color + "";

                if (sq.groupNumber === 1 || sq.groupNumber === 2) {
                    html += " border: 1px solid grey"
                }

                html += "' onmouseover='showdeed(" + i + ")' onmouseout='hidedeed()'></td><td class='statscellname' " + mortgageText + ">" + sq.name + houseText + "</td></tr>"
            }
        }

        if (p.communityChestJailCard) {
            if (!write) {
                write = true;
                html += "<table>"
            }
            html += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>"

        }
        if (p.chanceJailCard) {
            if (!write) {
                write = true;
                html += "<table>"
            }
            html += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>"

        }

        if (!write) {
            html += p.name + " dosen't have any properties."
        } else {
            html += "</table>"
        }

        html += "</td>"
    }
    html += "</tr></table><div id='titledeed'></div>";

    document.getElementById("statstext").innerHTML = html;
    // Show using animation.
    $("#statsbackground").fadeIn(350, function () {
        $("#statswrap").show()
    })
}

/**
 * Показать действие
 * @param {int} property - Свойство клетки
 */
function showdeed(property) {
    let sq = square[property];
    $("#deed").show();

    $("#deed-normal").hide();
    $("#deed-mortgaged").hide();
    $("#deed-special").hide();

    if (sq.mortgage) {
        $("#deed-mortgaged").show();
        document.getElementById("deed-mortgaged-name").textContent = sq.name;
        document.getElementById("deed-mortgaged-mortgage").textContent = (sq.price / 2)

    } else {

        if (sq.groupNumber >= 3) {
            $("#deed-normal").show();
            document.getElementById("deed-header").style.backgroundColor = sq.color;
            document.getElementById("deed-name").textContent = sq.name;
            document.getElementById("deed-baseRent").textContent = sq.baseRent;
            document.getElementById("deed-rent1").textContent = sq.rent1;
            document.getElementById("deed-rent2").textContent = sq.rent2;
            document.getElementById("deed-rent3").textContent = sq.rent3;
            document.getElementById("deed-rent4").textContent = sq.rent4;
            document.getElementById("deed-rent5").textContent = sq.rent5;
            document.getElementById("deed-mortgage").textContent = (sq.price / 2);
            document.getElementById("deed-housePrice").textContent = sq.housePrice;
            document.getElementById("deed-hotelprice").textContent = sq.housePrice

        } else if (sq.groupNumber === 2) {
            $("#deed-special").show();
            document.getElementById("deed-special-name").textContent = sq.name;
            document.getElementById("deed-special-text").innerHTML = utilText();
            document.getElementById("deed-special-mortgage").textContent = (sq.price / 2)

        } else if (sq.groupNumber === 1) {
            $("#deed-special").show();
            document.getElementById("deed-special-name").textContent = sq.name;
            document.getElementById("deed-special-text").innerHTML = transText();
            document.getElementById("deed-special-mortgage").textContent = (sq.price / 2)
        }
    }
}

/**
 * Скрыть действие
 */
function hidedeed() {
    $("#deed").hide()
}

/**
 * Купить имущество
 */
function buy() {
    let p = player[turn];
    let property = square[p.position];
    let cost = property.price;

    if (p.money >= cost) {
        p.pay(cost, 0);

        property.owner = turn;
        updateMoney();
        addAlert(p.name + " bought " + property.name + " for " + property.pricetext + ".");

        updateOwned();

        $("#landed").hide()

    } else {
        popup("<p>" + p.name + ", you need $" + (property.price - p.money) + " more to buy " + property.name + ".</p>")
    }
}

/**
 * Заложить имущество
 * @param {int} index - Номер клетки
 * @return {boolean} Возвращает состояние
 */
function mortgage(index) {
    let sq = square[index];
    let p = player[sq.owner];

    if (sq.house > 0 || sq.hotel > 0 || sq.mortgage) {
        return false
    }

    let mortgagePrice = Math.round(sq.price * 0.5);
    let unmortgagePrice = Math.round(sq.price * 0.6);

    sq.mortgage = true;
    p.money += mortgagePrice;

    document.getElementById("mortgagebutton").value = "Unmortgage for $" + unmortgagePrice;
    document.getElementById("mortgagebutton").title = "Unmortgage " + sq.name + " for $" + unmortgagePrice + ".";

    addAlert(p.name + " mortgaged " + sq.name + " for $" + mortgagePrice + ".");
    updateOwned();
    updateMoney();

    return true
}

/**
 * Выкупить заложенное имущество
 * @param {int} index - номер клетки
 * @return {boolean} Возвращает состояние
 */
function unmortgage(index) {
    let sq = square[index];
    let p = player[sq.owner];
    let unmortgagePrice = Math.round(sq.price * 0.6);
    let mortgagePrice = Math.round(sq.price * 0.5);

    if (unmortgagePrice > p.money || !sq.mortgage) {
        return false
    }

    p.pay(unmortgagePrice, 0);
    sq.mortgage = false;
    document.getElementById("mortgagebutton").value = "Mortgage for $" + mortgagePrice;
    document.getElementById("mortgagebutton").title = "Mortgage " + sq.name + " for $" + mortgagePrice + ".";

    addAlert(p.name + " unmortgaged " + sq.name + " for $" + unmortgagePrice + ".");
    updateOwned();
    return true
}

/**
 * Попадание на клетку
 * @param {boolean} increasedRent - Повышенная аренда
 */
function land(increasedRent) {
    increasedRent = !!increasedRent; // Cast increasedRent to a boolean value. It is used for the ADVANCE TO THE NEAREST RAILROAD/UTILITY Chance cards.

    let p = player[turn];
    let s = square[p.position];

    let die1 = game.getDie(true);
    let die2 = game.getDie(false);

    $("#landed").show();
    document.getElementById("landed").innerHTML = "You landed on " + s.name + ".";
    s.landcount++;
    addAlert(p.name + " landed on " + s.name + ".");

    // Allow player to buy the property on which he landed.
    if (s.price !== 0 && s.owner === 0) {

        if (!p.human) {

            if (p.AI.buyProperty(p.position)) {
                buy()
            }
        } else {
            document.getElementById("landed").innerHTML = "<div>You landed on <a href='javascript:void(0)' onmouseover='showdeed(" + p.position + ")' onmouseout='hidedeed()' class='statscellcolor'>" + s.name + "</a>.<input type='button' onclick='buy()' value='Buy ($" + s.price + ")' title='Buy " + s.name + " for " + s.pricetext + ".'/></div>"
        }


        game.addPropertyToAuctionQueue(p.position)
    }

    // Collect rent
    if (s.owner !== 0 && s.owner !== turn && !s.mortgage) {
        let groupowned = true;
        let rent;

        // Railroads
        if (p.position === 5 || p.position === 15 || p.position === 25 || p.position === 35) {
            if (increasedRent) {
                rent = 25
            } else {
                rent = 12.5
            }

            if (s.owner === square[5].owner) {
                rent *= 2
            }
            if (s.owner === square[15].owner) {
                rent *= 2
            }
            if (s.owner === square[25].owner) {
                rent *= 2
            }
            if (s.owner === square[35].owner) {
                rent *= 2
            }

        } else if (p.position === 12) {
            if (increasedRent || square[28].owner === s.owner) {
                rent = (die1 + die2) * 10
            } else {
                rent = (die1 + die2) * 4
            }

        } else if (p.position === 28) {
            if (increasedRent || square[12].owner === s.owner) {
                rent = (die1 + die2) * 10
            } else {
                rent = (die1 + die2) * 4
            }

        } else {

            for (let i = 0; i < 40; i++) {
                sq = square[i];
                if (sq.groupNumber === s.groupNumber && sq.owner != s.owner) {
                    groupowned = false
                }
            }

            if (!groupowned) {
                rent = s.baseRent
            } else {
                if (s.house === 0) {
                    rent = s.baseRent * 2
                } else {
                    rent = s["rent" + s.house]
                }
            }
        }

        addAlert(p.name + " paid $" + rent + " rent to " + player[s.owner].name + ".");
        p.pay(rent, s.owner);
        player[s.owner].money += rent;

        document.getElementById("landed").innerHTML = "You landed on " + s.name + ". " + player[s.owner].name + " collected $" + rent + " rent."
    } else if (s.owner > 0 && s.owner !== turn && s.mortgage) {
        document.getElementById("landed").innerHTML = "You landed on " + s.name + ". Property is mortgaged no rent was collected."
    }

    // City Tax
    if (p.position === 4) {
        cityTax()
    }

    // Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.
    if (p.position === 30) {
        updateMoney();
        updatePosition();

        if (p.human) {
            popup("<div>Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.</div>", gotoJail)
        } else {
            gotoJail()
        }

        return
    }

    // Luxury Tax
    if (p.position === 38) {
        luxuryTax()
    }

    updateMoney();
    updatePosition();
    updateOwned();

    if (!p.human) {
        popup(p.AI.alertList, chanceCommunityChest);
        p.AI.alertList = ""
    } else {
        chanceCommunityChest()
    }
}

/**
 * Бросить кости
 */
function roll() {
    let p = player[turn];

    $("#option").hide();
    $("#buy").show();
    $("#manage").hide();

    if (p.human) {
        document.getElementById("nextbutton").focus()
    }
    document.getElementById("nextbutton").value = "End turn";
    document.getElementById("nextbutton").title = "End turn and advance to the next player.";

    game.rollDice();
    let die1 = game.getDie(true);
    let die2 = game.getDie(false);

    doublecount++;

    if (die1 === die2) {
        addAlert(p.name + " rolled " + (die1 + die2) + " - doubles.")
    } else {
        addAlert(p.name + " rolled " + (die1 + die2) + ".")
    }

    if (die1 === die2 && !p.jail) {
        updateDice(die1, die2);

        if (doublecount < 3) {
            document.getElementById("nextbutton").value = "Roll again";
            document.getElementById("nextbutton").title = "You threw doubles. Roll again."

            // If player rolls doubles three times in a row, send him to jail
        } else if (doublecount === 3) {
            p.jail = true;
            doublecount = 0;
            addAlert(p.name + " rolled doubles three times in a row.");
            updateMoney();


            if (p.human) {
                popup("You rolled doubles three times in a row. Go to jail.", gotoJail)
            } else {
                gotoJail()
            }

            return
        }
    } else {
        document.getElementById("nextbutton").value = "End turn";
        document.getElementById("nextbutton").title = "End turn and advance to the next player.";
        doublecount = 0
    }

    updatePosition();
    updateMoney();
    updateOwned();

    if (p.jail === true) {
        p.jailroll++;

        updateDice(die1, die2);
        if (die1 === die2) {
            document.getElementById("jail").style.border = "1px solid black";
            document.getElementById("cell11").style.border = "2px solid " + p.color;
            $("#landed").hide();

            p.jail = false;
            p.jailroll = 0;
            p.position = 10 + die1 + die2;
            doublecount = 0;

            addAlert(p.name + " rolled doubles to get out of jail.");

            land()
        } else {
            if (p.jailroll === 3) {

                if (p.human) {
                    popup("<p>You must pay the $50 fine.</p>", function () {
                        payFifty();
                        payfifty();
                        player[turn].position = 10 + die1 + die2;
                        land()
                    })
                } else {
                    payfifty();
                    p.position = 10 + die1 + die2;
                    land()
                }
            } else {
                $("#landed").show();
                document.getElementById("landed").innerHTML = "You are in jail.";

                if (!p.human) {
                    popup(p.AI.alertList, game.next);
                    p.AI.alertList = ""
                }
            }
        }


    } else {
        updateDice(die1, die2);

        // Move player
        p.position += die1 + die2;

        // Collect $200 salary as you pass GO
        if (p.position >= 40) {
            p.position -= 40;
            p.money += 200;
            addAlert(p.name + " collected a $200 salary for passing GO.")
        }

        land()
    }
}

/**
 * Начало игры
 */
function play() {
    if (game.auction()) {
        return
    }

    turn++;
    if (turn > pcount) {
        turn -= pcount
    }

    let p = player[turn];
    game.resetDice();

    document.getElementById("pname").innerHTML = p.name;

    addAlert("It is " + p.name + "'s turn.");

    // Check for bankruptcy.
    p.pay(0, p.creditor);

    $("#landed, #option, #manage").hide();
    $("#board, #control, #moneybar, #viewstats, #buy").show();

    doublecount = 0;
    if (p.human) {
        document.getElementById("nextbutton").focus()
    }
    document.getElementById("nextbutton").value = "Roll Dice";
    document.getElementById("nextbutton").title = "Roll the dice and move your token accordingly.";

    $("#die0").hide();
    $("#die1").hide();

    if (p.jail) {
        $("#landed").show();
        document.getElementById("landed").innerHTML = "You are in jail.<input type='button' title='Pay $50 fine to get out of jail immediately.' value='Pay $50 fine' onclick='payfifty()' />";

        if (p.communityChestJailCard || p.chanceJailCard) {
            document.getElementById("landed").innerHTML += "<input type='button' id='gojfbutton' title='Use &quotGet Out of Jail Free&quot card.' onclick='useJailCard()' value='Use Card' />"
        }

        document.getElementById("nextbutton").title = "Roll the dice. If you throw doubles, you will get out of jail.";

        if (p.jailroll === 0)
            addAlert("This is " + p.name + "'s first turn in jail.");
        else if (p.jailroll === 1)
            addAlert("This is " + p.name + "'s second turn in jail.");
        else if (p.jailroll === 2) {
            document.getElementById("landed").innerHTML += "<div>NOTE: If you do not throw doubles after this roll, you <i>must</i> pay the $50 fine.</div>";
            addAlert("This is " + p.name + "'s third turn in jail.")
        }

        if (!p.human && p.AI.postBail()) {
            if (p.communityChestJailCard || p.chanceJailCard) {
                useJailCard()
            } else {
                payfifty()
            }
        }
    }

    updateMoney();
    updatePosition();
    updateOwned();

    $(".money-bar-arrow").hide();
    $("#p" + turn + "arrow").show();

    if (!p.human) {
        if (!p.AI.beforeTurn()) {
            game.next()
        }
    }
}

/**
 * Допустимые цвета
 * @type {{available_colors: string[]}}
 */
let game_ns = {
    available_colors: ['blue', 'red', 'green', 'yellow', 'aqua', 'black', 'fuchsia', 'gray', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'silver', 'teal']
};
/**
 * Запуск настроек
 */
game_ns.draw_setup = function () {
    /**
     * Настройки отрисовки
     * @type {{}}
     */
    let context = game_ns._draw_setup;

    context.draw_player_wrappers(8);
    context.bind_player_inteligence_change();
    context.bind_and_invoke_player_color_change();
    context.bind_and_invoke_players_count_change()
};

/**
 * Настройки визуальной части игры
 * @type {{}}
 * @protected
 */
game_ns._draw_setup = {};

/**
 * Отрисовка игроков на карте
 * @param {int} max
 */
game_ns._draw_setup.draw_player_wrappers = function (max) {
    let i, color;

    let content = "";

    let content_intel = "";
    content_intel += "<select class='player-intel' title='Choose whether this player is controled by a human or by the computer.'>";
    content_intel += "	<option value='0' selected='selected'>Human</option>";
    content_intel += "	<option value='1'>AI (Test)</option>";
    content_intel += "</select>";

    let content_colors = "<select class='player-color' title='Player color'>";
    for (i = 0; i <= game_ns.available_colors.length - 1; i++) {
        color = game_ns.available_colors[i];
        content_colors += "<option style='color: " + color + "'>" + color + "</option>"
    }
    content_colors += "</select>";

    for (i = 1; i <= max; i++) {
        content += "<div id='player" + i + "wrap' data-id='" + i + "' class='player-wrap'>";
        content += "Player " + i + ": ";
        content += "<input type='text' class='player-name' title='Player name' maxlength='16' value='Player " + i + "' /> ";
        content += content_colors;
        content += " ";
        content += content_intel;
        content += "</div>"
    }

    $("#player-wrappers").append(content)
};

/**
 * Настройка ботов
 */
game_ns._draw_setup.bind_player_inteligence_change = function () {
    $("#player-wrappers .player-intel").change(function () {
        let val = $(this).val();
        let boo = val !== '0';
        let wrap = $(this).closest('.player-wrap');

        wrap.find('.player-name').attr('disabled', boo);
        wrap.nextAll().find('.player-name').attr('disabled', boo);
        wrap.nextAll().find('.player-intel').val(val)
    })
};

/**
 * Изменение цветов игроков
 */
game_ns._draw_setup.bind_and_invoke_player_color_change = function () {
    $("#player-wrappers .player-color").on("change", game_ns._draw_setup.select_on_player_color_change);
    $("#player-wrappers .player-color").change()
};

/**
 * Изменение количества игроков
 */
game_ns._draw_setup.bind_and_invoke_players_count_change = function () {
    $("#playernumber").on("change", game_ns._draw_setup.select_on_player_number_change);
    $("#playernumber").change()
};

/**
 * Отрисовка смены номера игрока
 */
game_ns._draw_setup.select_on_player_number_change = function () {
    pcount = parseInt(document.getElementById("playernumber").value, 10);

    $(".player-wrap").hide();

    for (let i = 1; i <= pcount; i++) {
        $("#player" + i + "wrap").show()
    }
};

/**
 * Отрисовка смены игрока
 */
game_ns._draw_setup.select_on_player_color_change = function () {
    let colors_taken = [];

    let wrap = $(this).closest('.player-wrap');

    // assume current and before as static
    colors_taken.push($(this).val());

    // change any next to any other color
    wrap.siblings().each(function (index, el) {
        let el2 = $(el).find('.player-color');
        let val2 = el2.val();
        let is_already_present = colors_taken.indexOf(val2) !== -1;
        if (is_already_present) {
            // change its color to next available
            let colors_not_taken = arr_diff(game_ns.available_colors, colors_taken);
            el2.val(colors_not_taken[0])
        }

        // refresh val2
        val2 = el2.val();
        colors_taken.push(val2)

    })

};

/**
 * Настройка параметров игры
 */
game_ns.setup = function () {

    pcount = parseInt(document.getElementById("playernumber").value, 10);

    let playerArray = new Array(pcount);
    let p, wrap, intel;

    playerArray.randomize();

    for (let i = 1; i <= pcount; i++) {
        p = player[playerArray[i - 1]];

        wrap = $("div#player" + i + "wrap");
        intel = wrap.find("select.player-intel").val();

        p.color = wrap.find("select.player-color").val().toLowerCase();

        if (intel === "0") {
            p.name = wrap.find("input.player-name").val();
            p.human = true
        } else {
            p.human = false;
            p.AI = new AITest(p)
        }
    }

    $("#board, #moneybar").show();
    $("#setup").hide();

    if (pcount === 2) {
        document.getElementById("stats").style.width = "454px"
    } else if (pcount === 3) {
        document.getElementById("stats").style.width = "686px"
    }

    document.getElementById("stats").style.top = "0px";
    document.getElementById("stats").style.left = "0px";

    play()
};


/**
 * Проверяет состояние свойства
 *
 * Возвращает номер включенного свойства, если таких нет, то возвращает -1
 * @return {number} Возвращает номер свойства
 */
function getCheckedProperty() {
    for (let i = 0; i < 42; i++) {
        if (document.getElementById("propertycheckbox" + i) && document.getElementById("propertycheckbox" + i).checked) {
            return i
        }
    }
    return -1 // No property is checked.
}

/**
 * Присваивает класс menuitem, menuitem_hover
 * @param element - HTML элемент
 */
function menuitem_onmouseover(element) {
    element.className = "menuitem menuitem_hover";
}

/**
 * Присваивает класс menuitem
 * @param element - HTML элемент
 */
function menuitem_onmouseout(element) {
    element.className = "menuitem";
}

/**
 * Инициализация игры, отрисовка карты
 */
window.onload = function () {
    game_ns.draw_setup();

    game = new Game();

    for (let i = 0; i <= 8; i++) {
        player[i] = new Player("", "");
        player[i].index = i
    }

    let groupPropertyArray = [];
    let groupNumber;

    for (let i = 0; i < 40; i++) {
        groupNumber = square[i].groupNumber;

        if (groupNumber > 0) {
            if (!groupPropertyArray[groupNumber]) {
                groupPropertyArray[groupNumber] = []
            }

            groupPropertyArray[groupNumber].push(i)
        }
    }

    for (let i = 0; i < 40; i++) {
        groupNumber = square[i].groupNumber;

        if (groupNumber > 0) {
            square[i].group = groupPropertyArray[groupNumber]
        }

        square[i].index = i
    }

    AITest.count = 0;

    player[1].human = true;
    player[0].name = "the bank";

    communityChestCards.index = 0;
    chanceCards.index = 0;

    communityChestCards.deck = [];
    chanceCards.deck = [];

    for (let i = 0; i < 16; i++) {
        chanceCards.deck[i] = i;
        communityChestCards.deck[i] = i
    }

    // Shuffle Chance and Community Chest decks.
    chanceCards.deck.sort(function () {
        return Math.random() - 0.5
    });
    communityChestCards.deck.sort(function () {
        return Math.random() - 0.5
    });

    $("#nextbutton").click(game.next);
    $("#noscript").hide();
    $("#setup, #noF5").show();

    let enlargeWrap = document.body.appendChild(document.createElement("div"));

    enlargeWrap.id = "enlarge-wrap";

    let html = "";
    for (let i = 0; i < 40; i++) {
        html += "<div id='enlarge" + i + "' class='enlarge'>";
        html += "<div id='enlarge" + i + "color' class='enlarge-color'></div><br /><div id='enlarge" + i + "name' class='enlarge-name'></div>";
        html += "<br /><div id='enlarge" + i + "price' class='enlarge-price'></div>";
        html += "<br /><div id='enlarge" + i + "token' class='enlarge-token'></div></div>"
    }

    enlargeWrap.innerHTML = html;

    /**
     * Текущие значения клетки, позиции, владельца клетки
     */
    let currentCell;
    let currentCellAnchor;
    let currentCellPositionHolder;
    let currentCellName;
    let currentCellOwner;

    for (let i = 0; i < 40; i++) {
        s = square[i];

        currentCell = document.getElementById("cell" + i);

        currentCellAnchor = currentCell.appendChild(document.createElement("div"));
        currentCellAnchor.id = "cell" + i + "anchor";
        currentCellAnchor.className = "cell-anchor";

        currentCellPositionHolder = currentCellAnchor.appendChild(document.createElement("div"));
        currentCellPositionHolder.id = "cell" + i + "positionholder";
        currentCellPositionHolder.className = "cell-position-holder";
        currentCellPositionHolder.enlargeId = "enlarge" + i;

        currentCellName = currentCellAnchor.appendChild(document.createElement("div"));
        currentCellName.id = "cell" + i + "name";
        currentCellName.className = "cell-name";
        currentCellName.textContent = s.name;

        if (square[i].groupNumber) {
            currentCellOwner = currentCellAnchor.appendChild(document.createElement("div"));
            currentCellOwner.id = "cell" + i + "owner";
            currentCellOwner.className = "cell-owner"
        }

        document.getElementById("enlarge" + i + "color").style.backgroundColor = s.color;
        document.getElementById("enlarge" + i + "name").textContent = s.name;
        document.getElementById("enlarge" + i + "price").textContent = s.pricetext
    }


    // Add images to enlarges.
    document.getElementById("enlarge0token").innerHTML += '<img src="images/arrow_icon.png" height="40" width="136" alt="" />';
    document.getElementById("enlarge20price").innerHTML += "<img src='images/free_parking_icon.png' height='80' width='72' alt='' style='position: relative top: -20px' />";
    document.getElementById("enlarge38token").innerHTML += '<img src="images/tax_icon.png" height="60" width="70" alt="" style="position: relative top: -20px" />';

    corrections();

    // Jail corrections
    $("<div>", {id: "jailpositionholder"}).appendTo("#jail");
    $("<span>").text("Jail").appendTo("#jail");

    document.getElementById("jail").enlargeId = "enlarge40";

    document.getElementById("enlarge-wrap").innerHTML += "<div id='enlarge40' class='enlarge'><div id='enlarge40color' class='enlarge-color'></div><br /><div id='enlarge40name' class='enlarge-name'>Jail</div><br /><div id='enlarge40price' class='enlarge-price'><img src='images/jake_icon.png' height='80' width='80' alt='' style='position: relative top: -20px' /></div><br /><div id='enlarge40token' class='enlarge-token'></div></div>";

    document.getElementById("enlarge40name").innerHTML = "Jail";

    // Create event handlers for hovering and draging.

    /**
     * Координаты для анимаций
     */
    let drag;
    let dragX;
    let dragY;
    let dragObj;
    let dragTop;
    let dragLeft;

    /**
     * Анимация при попадании в тюрьму
     */
    $(".cell-position-holder, #jail").on("mouseover", function () {
        $("#" + this.enlargeId).show()

    }).on("mouseout", function () {
        $("#" + this.enlargeId).hide()

    }).on("mousemove", function (e) {
        let element = document.getElementById(this.enlargeId);

        if (e.clientY + 20 > window.innerHeight - 204) {
            element.style.top = (window.innerHeight - 204) + "px"
        } else {
            element.style.top = (e.clientY + 20) + "px"
        }

        element.style.left = (e.clientX + 10) + "px"
    });

    /**
     * Анимация объектов игры
     */
    $("body").on("mousemove", function (e) {
        let object;

        if (e.target) {
            object = e.target
        } else if (window.event && window.event.srcElement) {
            object = window.event.srcElement
        }


        if (object.classList.contains("propertycellcolor") || object.classList.contains("statscellcolor")) {
            if (e.clientY + 20 > window.innerHeight - 279) {
                document.getElementById("deed").style.top = (window.innerHeight - 279) + "px"
            } else {
                document.getElementById("deed").style.top = (e.clientY + 20) + "px"
            }
            document.getElementById("deed").style.left = (e.clientX + 10) + "px"


        } else if (drag) {
            if (e) {
                dragObj.style.left = (dragLeft + e.clientX - dragX) + "px";
                dragObj.style.top = (dragTop + e.clientY - dragY) + "px"

            } else if (window.event) {
                dragObj.style.left = (dragLeft + window.event.clientX - dragX) + "px";
                dragObj.style.top = (dragTop + window.event.clientY - dragY) + "px"
            }
        }
    });


    /**
     * Изменение состояния перетаскивания
     */
    $("body").on("mouseup", function () {
        drag = false
    });

    /**
     * Перетаскивание статистики игры
     * @param {Object} e - ивент
     */
    document.getElementById("statsdrag").onmousedown = function (e) {
        dragObj = document.getElementById("stats");
        dragObj.style.position = "relative";

        dragTop = parseInt(dragObj.style.top, 10) || 0;
        dragLeft = parseInt(dragObj.style.left, 10) || 0;

        if (window.event) {
            dragX = window.event.clientX;
            dragY = window.event.clientY
        } else if (e) {
            dragX = e.clientX;
            dragY = e.clientY
        }

        drag = true
    };

    /**
     * Анимация хода игрока
     * @param {Object} e - ивент
     */
    document.getElementById("popupdrag").onmousedown = function (e) {
        dragObj = document.getElementById("popup");
        dragObj.style.position = "relative";

        dragTop = parseInt(dragObj.style.top, 10) || 0;
        dragLeft = parseInt(dragObj.style.left, 10) || 0;

        if (window.event) {
            dragX = window.event.clientX;
            dragY = window.event.clientY
        } else if (e) {
            dragX = e.clientX;
            dragY = e.clientY
        }

        drag = true
    };

    /**
     * Заложить имущество игрока
     */
    $("#mortgagebutton").click(function () {
        let checkedProperty = getCheckedProperty();
        let s = square[checkedProperty];

        if (s.mortgage) {
            if (player[s.owner].money < Math.round(s.price * 0.6)) {
                popup("<p>You need $" + (Math.round(s.price * 0.6) - player[s.owner].money) + " more to unmortgage " + s.name + ".</p>")

            } else {
                popup("<p>" + player[s.owner].name + ", are you sure you want to unmortgage " + s.name + " for $" + Math.round(s.price * 0.6) + "?</p>", function () {
                    unmortgage(checkedProperty)
                }, "Да/Нет")
            }
        } else {
            popup("<p>" + player[s.owner].name + ", are you sure you want to mortgage " + s.name + " for $" + Math.round(s.price * 0.5) + "?</p>", function () {
                mortgage(checkedProperty)
            }, "Да/Нет")
        }

    });

    /**
     * Покупка имущества
     */
    $("#buyHouseButton").on("click", function () {
        let checkedProperty = getCheckedProperty();
        let s = square[checkedProperty];
        let p = player[s.owner];
        let houseSum = 0;
        let hotelSum = 0;

        if (p.money < s.housePrice) {
            if (s.house === 4) {
                popup("<p>You need $" + (s.housePrice - player[s.owner].money) + " more to buy a hotel for " + s.name + ".</p>");
                return
            } else {
                popup("<p>You need $" + (s.housePrice - player[s.owner].money) + " more to buy a house for " + s.name + ".</p>");
                return
            }
        }

        for (let i = 0; i < 40; i++) {
            if (square[i].hotel === 1) {
                hotelSum++
            } else {
                houseSum += square[i].house
            }
        }

        if (s.house < 4 && houseSum >= 32) {
            popup("<p>All 32 houses are owned. You must wait until one becomes available.</p>");
            return
        } else if (s.house === 4 && hotelSum >= 12) {
            popup("<p>All 12 hotels are owned. You must wait until one becomes available.</p>");
            return
        }

        buyHouse(checkedProperty)

    });

    /**
     * Продажа имущества
     */
    $("#sellHouseButton").click(function () {
        sellHouse(getCheckedProperty())
    });

    /**
     * Показывает статистику
     */
    $("#viewstats").on("click", showStats);
    $("#statsclose, #statsbackground").on("click", function () {
        $("#statswrap").hide();
        $("#statsbackground").fadeOut(400)
    });

    /**
     * Показывает блок покупки и скрывает блок управления
     */
    $("#buy-menu-item").click(function () {
        $("#buy").show();
        $("#manage").hide();

        // Scroll alerts to bottom.
        $("#alert").scrollTop($("#alert").prop("scrollHeight"))
    });

    /**
     * Показывает блок управления и скрывает блок торговли
     */
    $("#manage-menu-item").click(function () {
        $("#manage").show();
        $("#buy").hide()
    });

    /**
     * Начать торговлю
     */
    $("#trade-menu-item").click(game.trade)


};

/**Функция для нахождения разницы массивов
 * Используется для нахождения доступных во время хода клеток
 *
 * @param {Array} a1 - первый массив
 * @param {Array} a2 - второй массив
 * @return {Array} Возвращает разницу двух массивов.
 *
 */
function arr_diff(a1, a2) {
    let a = [], diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]]
        } else {
            a[a2[i]] = true
        }
    }

    for (let k in a) {
        diff.push(k)
    }
    return diff
}
