import * as React from "react";


function TimeCounter({ resendHandler, style, className }) {
    const [counter, setCounter] = React.useState(30);

    React.useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);

    function prependZero(number) {
        if (number < 10) {
            console.log('num',number)
            if (number === 0) {
                resendHandler()
            }
            return "0" + number;
        }
        else
            return number;
    }

    return (
        <div>
            <div style={{ textAlign: 'center' ,fontSize: '18px' ,color: '#336aff', ...style }} className={className}>00 : {prependZero(counter)}</div>
        </div>
    );
}

export default TimeCounter;