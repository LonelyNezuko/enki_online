export let ioSocket = null
export function ioConnect()
{
    ioSocket = io()
}
