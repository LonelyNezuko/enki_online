import './loaderMini.scss'
export default function LoaderMini({ size = 'normal' }) {
    return (
        <div class={`_loaderMini ${size}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}