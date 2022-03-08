import { useEffect, useRef } from 'react';

export default function MarkerPopup(props: any) {
    const ref = useRef<any>(null);
    const { onClickOutside } = props;

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside && onClickOutside();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ onClickOutside ]);

    if(!props.show)
        return null;

    return (
        <div ref={ref} className='info-box'>
            {props.message}
        </div> );
}