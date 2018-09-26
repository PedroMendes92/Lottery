const numbers = {

    settings: {
        container: $(".numbers"),
        classContainer: "numbers",
        amountOfNumbers: 59,
        classGuessed: "guessed",
        classBtn: "number",
        classSelected: "selected"
    },

    init: function () {

        const s = this.settings;

        for (let i = 1; i <= s.amountOfNumbers; i++) {
            s.container.append(
                `<div id='${i}' class='${s.classBtn}'>${i}</div>`
            );
        }

        $(`.${s.classContainer} > div`).on("click", (event) => this.handleSelect(event));
    },

    handleSelect: function (event) {
        const s = this.settings;

        let target = $(event.target);

        if (target.hasClass(s.classSelected)) {

            target.removeClass(s.classSelected);

        } else {

            target.addClass(s.classSelected);
        }

    },

    setNumberSelected: function (number) {
        const s = this.settings;
        $(`.${s.classContainer} > div#${number}`).addClass(s.classSelected);
    },

    getSelectedNumbers: function () {
        const s = this.settings;
        return $(`.${s.classContainer} > div.${s.classSelected}`);
    },

    resetNumbers: function () {
        const s = this.settings;
        $(`.${s.classContainer} > div.${s.classSelected}`).removeClass(s.classSelected);
    },

    generateSixNumbers: function () {
        const s = this.settings
        let tempNumbers = [];
        while (tempNumbers.length < 6) {
            const newCandidateNumber = Math.floor(Math.random() * s.amountOfNumbers) + 1;
            if (tempNumbers.filter((n) => {
                    return n == newCandidateNumber
                }).length == 0) {
                tempNumbers.push(newCandidateNumber);
            }
        }
        return tempNumbers;
    },
    displayGuessedNumers: function (numbersArray) {
        $.each(this.getSelectedNumbers(), (i, elem) => {
            $.each(numbersArray, (j, guessedNumber) => {
                if (elem.id == guessedNumber) {
                    $(elem).addClass(this.settings.classGuessed);
                }
            });
        });
    },
    removeAllGuessed: function () {
        const s = this.settings;
        $(`.${s.classContainer} > div.${s.classGuessed}`).removeClass(s.classGuessed);
    }

};

const prizeInfo = {

    settings: {
        container: $(".prizesInfo"),
    },
    init: function () {
        this.settings.container.find(".blink").removeClass("blink")
    },
    showPrizeEarned: function (prize) {

        this.settings.container.find(`#${prize}`).addClass("blink");

    }

};

const prizedNumbers = {

    settings: {
        container: $(".prizedNumbers"),
        numbers: [0, 0, 0, 0, 0, 0],
    },

    init: function () {
        const s = this.settings;
        this.displayPrizedNumbers();
    },

    generatePrizedNumbers: function () {
        this.settings.numbers = numbers.generateSixNumbers().sort((a, b) => {
            return a - b;
        });
    },

    displayPrizedNumbers: function () {
        const s = this.settings;
        $.each(s.numbers, (i, elem) => {
            s.container.find(`#${i}`).html(elem);
        });
    },

    resetPrizedNumbers: function () {
        this.settings.numbers = [0, 0, 0, 0, 0, 0];
    },

    compareSelectedAndPrizedNumbers: function (selectedNumbers) {
        let matchNumbers = 0;

        $.each(this.settings.numbers, (i, elem) => {
            $.each(selectedNumbers, (j, sElem) => {
                if (elem == sElem.innerText) {
                    matchNumbers++;
                }
            })
        });

        return matchNumbers;
    },
    getSelectedNumbers: function () {
        return this.settings.numbers;
    }
};

const credits = {

    settings: {
        value: $(".credits #value"),
        credit: 200
    },
    init: function () {
        const s = this.settings;
        s.credit = 200;
        s.value.html(s.credit);
    },
    addCredit: function (amount) {
        const s = this.settings;
        s.credit += amount;
    },
    removeCredit: function (amount) {
        const s = this.settings;
        const result = s.credit - amount;
        s.credit = result < 0 ? 0 : result;
    },
    displayCredits: function () {
        const s = this.settings;
        s.value.html(s.credit);
    }


};

const buttons = {

    settings: {
        reset: $(".buttons #reset"),
        luckyDip: $(".buttons #luckyDip"),
        go: $(".buttons #go")
    },
    init: function () {

        const s = this.settings;

        s.reset.on("click", () => this.handleReset());
        s.luckyDip.on("click", () => this.handleLuckyDip());
        s.go.on("click", () => this.handleGo());
    },
    handleReset: function () {
        numbers.resetNumbers();
        numbers.removeAllGuessed();
        prizeInfo.init();
        prizedNumbers.resetPrizedNumbers();
        prizedNumbers.displayPrizedNumbers();
        credits.init();
    },
    handleLuckyDip: function () {
        numbers.resetNumbers();
        nextSelectedNumbers = numbers.generateSixNumbers();
        $.each(nextSelectedNumbers, (i, elem) => {
            numbers.setNumberSelected(elem);
        })
    },
    handleGo: function () {

        prizeInfo.init();
        const selectedNumbers = numbers.getSelectedNumbers();

        if (selectedNumbers.length != 6 || credits.settings.credit == 0) {

            alert("You must select 6 numbers to GO and have credit available");

        } else {

            numbers.removeAllGuessed();

            credits.removeCredit(1);
            credits.displayCredits();

            prizedNumbers.generatePrizedNumbers();
            prizedNumbers.displayPrizedNumbers();

            const result =
                prizedNumbers.compareSelectedAndPrizedNumbers(selectedNumbers);

            if (result >= 3) {
                let creditsEarned = 0;
                switch (result) {
                    case 3:
                        creditsEarned = 50;
                        break;
                    case 4:
                        creditsEarned = 100;
                        break;
                    case 5:
                        creditsEarned = 200;
                        break;
                    case 6:
                        creditsEarned = 500;
                        break;

                }

                credits.addCredit(creditsEarned);
                credits.displayCredits();

                prizeInfo.showPrizeEarned(result);

                numbers.displayGuessedNumers(prizedNumbers.getSelectedNumbers());
                
            } else {
                //this.settings.go.trigger("click");
            }
        }
    },
};

numbers.init();
prizeInfo.init();
prizedNumbers.init();
credits.init();
buttons.init();