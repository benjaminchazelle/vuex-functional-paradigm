import VuexFunctionalParadigm from "../src/VuexFunctionalParadigm";

const FunctionalParadigm = new VuexFunctionalParadigm({
    "": {
        "A": {
            $default: () => true
        },
        "B": {
            $default: () => true
        },
        "C": {
            $default: () => true
        },
        "D": {
            $default: () => true
        },
        "E": {
            $default: () => true
        },
        "F": {
            $default: () => true
        },
        "G": {
            $default: () => true
        },
        "H": {
            $default: () => true
        },
        "I": {
            $default: () => true
        },
        "J": {
            $default: () => true
        },
        "K": {
            $default: () => true
        },
        "L": {
            $default: () => true
        },
        "M": {
            $default: () => true
        },
        "N": {
            $default: () => true
        },
        "O": {
            $default: () => true
        },
        "P": {
            $default: () => true
        }
    },
    "module": {
        "a": {
            $default: () => true
        },
        "b": {
            $default: () => true
        },
        "c": {
            $default: () => true
        },
        "d": {
            $default: () => true
        },
        "e": {
            $default: () => true
        },
        "f": {
            $default: () => true
        },
        "g": {
            $default: () => true
        },
        "h": {
            $default: () => true
        },
        "i": {
            $default: () => true
        },
        "j": {
            $default: () => true
        },
        "k": {
            $default: () => true
        },
        "l": {
            $default: () => true
        },
        "m": {
            $default: () => true
        },
        "n": {
            $default: () => true
        },
        "o": {
            $default: () => true
        },
        "p": {
            $default: () => true
        }
    }
});

describe("_parseDependencies", () => {

    it("Access root state from root (via state.key)", () => {
        const applyFunction = (self, state, rootState) => {
            console.log(state['A']);
            console.log(state["B"]);
            console.log(state[`C`]);
            console.log(state.D);
        };

        const dependencies = FunctionalParadigm._parseDependencies("", applyFunction.toString());

        expect(dependencies).toEqual({
            '': ['A', 'B', 'C', 'D']
        })
    });

    it("Access root state from root (via rootState.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['A']);
            console.log(rootState["B"]);
            console.log(rootState[`C`]);
            console.log(rootState.D);

            // Not a valid key
            console.log(rootState['module']);
            console.log(rootState["module"]);
            console.log(rootState[`module`]);
            console.log(rootState.module);
        };

        const dependencies = FunctionalParadigm._parseDependencies("", applyFunction.toString());

        expect(dependencies).toEqual({
            '': ['A', 'B', 'C', 'D']
        })
    });

    it("Access module state from root (via rootState.module.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['module']['a']);
            console.log(rootState['module']["b"]);
            console.log(rootState['module'][`c`]);
            console.log(rootState['module'].d);

            console.log(rootState["module"]['e']);
            console.log(rootState["module"]["f"]);
            console.log(rootState["module"][`g`]);
            console.log(rootState["module"].h);

            console.log(rootState[`module`]['i']);
            console.log(rootState[`module`]["j"]);
            console.log(rootState[`module`][`k`]);
            console.log(rootState[`module`].l);

            console.log(rootState.module['m']);
            console.log(rootState.module["n"]);
            console.log(rootState.module[`o`]);
            console.log(rootState.module.p);
        };

        const dependencies = FunctionalParadigm._parseDependencies("", applyFunction.toString());

        expect(dependencies).toEqual({
            module: [
                'a', 'b', 'c', 'd',
                'e', 'f', 'g', 'h',
                'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p'
            ]
        })
    });

    it("Access root state from root (via rootState.empty.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['']['A']);
            console.log(rootState['']["B"]);
            console.log(rootState[''][`C`]);
            console.log(rootState[''].D);

            console.log(rootState[""]['E']);
            console.log(rootState[""]["F"]);
            console.log(rootState[""][`G`]);
            console.log(rootState[""].H);

            console.log(rootState[``]['I']);
            console.log(rootState[``]["J"]);
            console.log(rootState[``][`K`]);
            console.log(rootState[``].L);
        };

        const dependencies = FunctionalParadigm._parseDependencies("", applyFunction.toString());

        expect(dependencies).toEqual({
            "": [
                'A', 'B', 'C', 'D',
                'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L'
            ]
        })
    });

    it("Access module state from module (via state.key)", () => {
        const applyFunction = (self, state, rootState) => {
            console.log(state['a']);
            console.log(state["b"]);
            console.log(state[`c`]);
            console.log(state.d);
        };

        const dependencies = FunctionalParadigm._parseDependencies("module", applyFunction.toString());

        expect(dependencies).toEqual({
            'module': ['a', 'b', 'c', 'd']
        })
    });

    it("Access root state from module (via rootState.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['A']);
            console.log(rootState["B"]);
            console.log(rootState[`C`]);
            console.log(rootState.D);

            // Not a valid key
            console.log(rootState['module']);
            console.log(rootState["module"]);
            console.log(rootState[`module`]);
            console.log(rootState.module);
        };

        const dependencies = FunctionalParadigm._parseDependencies("module", applyFunction.toString());

        expect(dependencies).toEqual({
            "": [
                'A', 'B', 'C', 'D',
            ]
        })
    });

    it("Access module state from module (via rootState.module.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['module']['a']);
            console.log(rootState['module']["b"]);
            console.log(rootState['module'][`c`]);
            console.log(rootState['module'].d);

            console.log(rootState["module"]['e']);
            console.log(rootState["module"]["f"]);
            console.log(rootState["module"][`g`]);
            console.log(rootState["module"].h);

            console.log(rootState[`module`]['i']);
            console.log(rootState[`module`]["j"]);
            console.log(rootState[`module`][`k`]);
            console.log(rootState[`module`].l);

            console.log(rootState.module['m']);
            console.log(rootState.module["n"]);
            console.log(rootState.module[`o`]);
            console.log(rootState.module.p);
        };

        const dependencies = FunctionalParadigm._parseDependencies("module", applyFunction.toString());

        expect(dependencies).toEqual({
            module: [
                'a', 'b', 'c', 'd',
                'e', 'f', 'g', 'h',
                'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p'
            ]
        })
    });

    it("Access root state from module (via rootState.empty.key)", () => {

        const applyFunction = (self, state, rootState) => {
            console.log(rootState['']['A']);
            console.log(rootState['']["B"]);
            console.log(rootState[''][`C`]);
            console.log(rootState[''].D);

            console.log(rootState[""]['E']);
            console.log(rootState[""]["F"]);
            console.log(rootState[""][`G`]);
            console.log(rootState[""].H);

            console.log(rootState[``]['I']);
            console.log(rootState[``]["J"]);
            console.log(rootState[``][`K`]);
            console.log(rootState[``].L);
        };

        const dependencies = FunctionalParadigm._parseDependencies("module", applyFunction.toString());

        expect(dependencies).toEqual({
            "": [
                'A', 'B', 'C', 'D',
                'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L'
            ]
        })
    });

    it("Access root state and state via dynamic arguments", () => {
        const applyFunction = (_self_, _state_, _rootState_) => {
            console.log(_state_['A']);
            console.log(_state_["B"]);
            console.log(_state_[`C`]);
            console.log(_state_.D);

            console.log(_rootState_['E']);
            console.log(_rootState_["F"]);
            console.log(_rootState_[`G`]);
            console.log(_rootState_.H);
        };

        const dependencies = FunctionalParadigm._parseDependencies("module", applyFunction.toString());

        expect(dependencies).toEqual({
            'module': ['A', 'B', 'C', 'D'],
            '': ['E', 'F', 'G', 'H']
        })
    });
})