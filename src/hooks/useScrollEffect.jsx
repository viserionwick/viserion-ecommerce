const useScrollEffect = () => {

    const styleOnScroll = (elements, onScrollUp, onScrollDown) => {

        let y = window.scrollY;
  
        const scrollControl = (e) => {
            if (elements.length) {

                // Check if all elements mounted
                let check = 0;
                elements.map(element => (
                    element.current &&
                    (
                        check = +1
                    )
                ))

                if (check === (elements.length - 1)) {

                    const w = e.currentTarget;

                    // UP SCROLL
                    if (y > w.scrollY) {

                        Object.keys(onScrollUp).map((property, index) => (
                            elements.map(element => (
                                element.current.style.setProperty(property, Object.values(onScrollUp)[index])
                            ))
                        ))

                    }

                    // DOWN SCROLL
                    else if (y < w.scrollY) {

                        Object.keys(onScrollDown).map((property, index) => (
                            elements.map(element => (
                                element.current.style.setProperty(property, Object.values(onScrollDown)[index])
                            ))
                        ))

                    }

                    y = w.scrollY;
                }
            }
            else {
                if (elements.current) {

                    const w = e.currentTarget;

                    // UP SCROLL
                    if (y > w.scrollY) {

                        Object.keys(onScrollUp).map((property, index) => (
                            elements.current.style.setProperty(property, Object.values(onScrollUp)[index])
                        ))

                    }

                    // DOWN SCROLL
                    else if (y < w.scrollY) {

                        Object.keys(onScrollDown).map((property, index) => (
                            elements.current.style.setProperty(property, Object.values(onScrollDown)[index])
                        ))

                    }

                    y = w.scrollY;
                }
            }
            
        }


        // Wheel for pc & TouchMove for mobile | onScroll has bugs.
        window.addEventListener("wheel", scrollControl);
        window.addEventListener("touchmove", scrollControl);

    }



    const functionOnScroll = (onScrollUp, onScrollDown) => {

        let y = window.scrollY;
  
        const scrollControl = (e) => {
            const w = e.currentTarget;

            // UP SCROLL
            if (y > w.scrollY) {

                onScrollUp();

            }

            // DOWN SCROLL
            else if (y < w.scrollY) {

                onScrollDown();

            }

            y = w.scrollY;
        }

        // Wheel for pc & TouchMove for mobile | onScroll has bugs.
        window.addEventListener("wheel", scrollControl);
        window.addEventListener("touchmove", scrollControl);
    }

    return { styleOnScroll, functionOnScroll }
}

export default useScrollEffect;