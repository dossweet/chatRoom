function findPrime() {
    for (let i = 1; i <= 500; i++) {
        let flag = true;
        if (i % 6 === 0) {
            flag = false;
        } else {
            for (let j = 2; j < i; j++) {
                if (i % j !== 0) {
                    flag = false;
                    break;
                }
            }
        }

        if (flag === true) {
            console.log(i);
        }
    }
}