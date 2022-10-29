{
    type CoffeeCup = {
        shots: number;
        hasMilk?: boolean;
        hasSugar?: boolean;
    };

    interface CoffeeMaker {
        makeCoffee(shots: number): CoffeeCup;
    }
    interface MilkFrother {
        makeMilk(cup: CoffeeCup): CoffeeCup;
    }
    interface SugarProvider {
        addSugar(cup: CoffeeCup): CoffeeCup;
    }

    class CoffeeMachine implements CoffeeMaker {
        private static BEANS_GRAMM_PER_SHOT: number = 7;
        private coffeeBeans: number = 0;
        public constructor(coffeeBeans: number) {
            this.coffeeBeans = coffeeBeans;
        }

        static makeMachine(coffeeBeans: number): CoffeeMachine {
            return new CoffeeMachine(coffeeBeans);
        }

        fillCoffeeBeans(beans: number) {
            if (beans < 0) {
                throw new Error('value for beans should be greater than 0');
            }
            this.coffeeBeans += beans;
        }
        clean() {
            console.log('cleaning the machine...');
        }
        private grindBeans(shots: number) {
            console.log(`grinding beans for ${shots}`);
            if (this.coffeeBeans < shots * CoffeeMachine.BEANS_GRAMM_PER_SHOT) {
                throw new Error('Not enough coffe beans! ');
            }

            this.coffeeBeans -= shots * CoffeeMachine.BEANS_GRAMM_PER_SHOT;
        }
        private preheat(): void {
            console.log('heading up... 🎇');
        }
        private extract(shots: number): CoffeeCup {
            console.log(`Pulling ${shots} shots...`);
            return {
                shots,
                hasMilk: false,
            };
        }
        makeCoffee(shots: number): CoffeeCup {
            this.grindBeans(shots);
            this.preheat();
            return this.extract(shots);
        }
    }
    // 우유 거품기 -> 커피머신을 새로 만드는 것이 아니라 기능을 새로 만듦.
    class CheapMilkSteamer implements MilkFrother {
        private steamMilk(): void {
            console.log('Steaming some milk...');
        }
        makeMilk(cup: CoffeeCup): CoffeeCup {
            this.steamMilk();
            return {
                ...cup,
                hasMilk: true,
            };
        }
    }
    class FancyMilkSteamer implements MilkFrother {
        private steamMilk(): void {
            console.log('Fancy Steaming some Milk');
        }
        makeMilk(cup: CoffeeCup): CoffeeCup {
            this.steamMilk();
            return {
                ...cup,
                hasMilk: true,
            };
        }
    }
    class ColdMilkSteamer implements MilkFrother {
        private steamMilk(): void {
            console.log('Cold Steaming some Milk');
        }
        makeMilk(cup: CoffeeCup): CoffeeCup {
            this.steamMilk();
            return {
                ...cup,
                hasMilk: true,
            };
        }
    }

    // 설탕 제조기
    class CandySugarMixer implements SugarProvider {
        private getSugar() {
            console.log('Getting some sugar from candy');
            return true;
        }
        addSugar(cup: CoffeeCup): CoffeeCup {
            const sugar = this.getSugar();
            return {
                ...cup,
                hasSugar: sugar,
            };
        }
    }
    class SugarMixer implements SugarProvider {
        private getSugar() {
            console.log('Getting some sugar from jar');
            return true;
        }
        addSugar(cup: CoffeeCup): CoffeeCup {
            const sugar = this.getSugar();
            return {
                ...cup,
                hasSugar: sugar,
            };
        }
    }

    class CaffeLatteMachine extends CoffeeMachine {
        // 만약 자식 클래스에서 자식 클래스에서만 받을 수 있는 인자가 있다면
        constructor(
            beans: number,
            public readonly serialNumber: string,
            private milkFrother: MilkFrother
        ) {
            super(beans);
        }
        makeCoffee(shots: number): CoffeeCup {
            const coffee = super.makeCoffee(shots); // 이 부분에서 이미 부모요소는 호출이 됨
            return this.milkFrother.makeMilk(coffee);
        }
    }

    class SweetCoffeemaker extends CoffeeMachine {
        constructor(private beans: number, private sugar: SugarProvider) {
            super(beans);
        }
        makeCoffee(shots: number): CoffeeCup {
            const coffee = super.makeCoffee(shots);
            return this.sugar.addSugar(coffee);
        }
    }

    class SweetCaffeLatteMachine extends CoffeeMachine {
        constructor(
            private beans: number,
            private milk: MilkFrother,
            private sugar: SugarProvider
        ) {
            super(beans);
        }
        makeCoffee(shots: number): CoffeeCup {
            const coffee = super.makeCoffee(shots);
            return this.milk.makeMilk(this.sugar.addSugar(coffee));
        }
    }
    const cheapMilkMaker = new CheapMilkSteamer();
    const fancyMilkMaker = new FancyMilkSteamer();
    const coldMilkMaker = new ColdMilkSteamer();

    const candySugar = new CandySugarMixer();
    const sugar = new SugarMixer();

    const sweetCandyMachine = new SweetCoffeemaker(12, candySugar);
    const sweetMachine = new SweetCoffeemaker(12, sugar);

    const latteMachine = new CaffeLatteMachine(12, 'ss', cheapMilkMaker);
    const coldLatteMachine = new CaffeLatteMachine(12, 'ss', coldMilkMaker);
    const sweetLatteMachine = new SweetCaffeLatteMachine(
        12,
        cheapMilkMaker,
        candySugar
    );
}
