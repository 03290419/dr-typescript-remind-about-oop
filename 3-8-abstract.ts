{
    type CoffeeCup = {
        shots: number;
        hasMilk?: boolean;
        hasSugar?: boolean;
    };

    interface CoffeeMaker {
        makeCoffee(shots: number): CoffeeCup;
    }

    abstract class CoffeeMachine implements CoffeeMaker {
        private static BEANS_GRAMM_PER_SHOT: number = 7;
        private coffeeBeans: number = 0;
        public constructor(coffeeBeans: number) {
            this.coffeeBeans = coffeeBeans;
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
        protected abstract extract(shots: number): CoffeeCup;
        makeCoffee(shots: number): CoffeeCup {
            this.grindBeans(shots);
            this.preheat();
            return this.extract(shots);
        }
    }

    class CaffeLatteMachine extends CoffeeMachine {
        // 만약 자식 클래스에서 자식 클래스에서만 받을 수 있는 인자가 있다면
        constructor(beans: number, public readonly serialNumber: string) {
            super(beans);
        }
        private steamMilk(): void {
            console.log('Steaming some milk...');
        }
        protected extract(shots: number): CoffeeCup {
            this.steamMilk();
            return {
                shots,
                hasMilk: true,
            };
        }
    }

    class SweetCoffeemaker extends CoffeeMachine {
        protected extract(shots: number): CoffeeCup {
            return {
                shots,
                hasSugar: true,
            };
        }
    }
    const machines: CoffeeMaker[] = [
        new CaffeLatteMachine(16, 'ssdd'),
        new SweetCoffeemaker(16),
        new CaffeLatteMachine(16, 'ssdd'),
        new SweetCoffeemaker(16),
    ];
    machines.forEach((machine) => {
        console.log('------------------------------');
        machine.makeCoffee(1);
    });
}
