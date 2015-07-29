function invoke(functionArg: () => void) {
    setTimeout(functionArg);
}
