# vuex-functional-paradigm

<p align="center">
  <img src="logo.png" alt="vuex-functional-paradigm logo" />
</p>

A way to functionally manage the Vuex store enhanced with a mechanism of functional dependencies within the state

## Introduction

Basiquement cette librairie permet de construire des stores en les décrivant de manières fonctionnelles. 

Elle apporte également une abstraction permettant de gérer la cohérence des propriétés de l'état dont le respect des contraintes de données les régissant.

Ces apports permettent de réduire le code de cérémonie telles que les redondances liées au maintien des contraintes de données afin de garder un code beaucoup plus orienté métier. 

Bien que le paradigme implémenté dans cette libraire soit un peu singulier, il reste toutefois très proche de certaines propositions de système de gestion d'état fonctionnel comme Redux.

De plus, cette librairie repose exclusivement sur l'architecture Vuex, elle n'en change pas le fonctionnement, et peut ainsi travailler avec les modules Vuex sans encombre.

## Install

```shell script
npm i vuex-functional-paradigm
```

## Get started

L'utilisation de vuex-functional-paradigm se compose de 4 parties :
- Une déclaration fonctionnelle de la logique du store
- Une génération du store fonctionnelle à partir la déclaration fonctionnelle
- Une injection du store fonctionnelle généré dans le store Vuex
- Un mapping des accesseurs et actions fonctionnelles dans les composants Vue

### Functional logic declaration

La logique fonctionnelle contient la logique métier du store sous forme déclarative. Cette dernière sera utilisée pour générer le store Vuex final. 

Elle se structure en un ensemble d'objets décrivant les propriétés de l'état (valeur par défaut, méthodes de mise à jour, contraintes de données en liant avec d'autres propriétés). 

#### `$default`

La clé $default d'une propriété fonctionnelle contient une fonction renvoyant sa valeur par défaut à l'initialisation du store.

Elle correspond à la valeur mis directement au sein du state dans la définition du store.

```js
{
    // ...

    spacecraft: { 
        // ...
        $default: () => ({
            name: "USS Enterprise",
            hasPilote: false,
            workingEngines: 4,
            canFly: false
        })
        // ...
    }
    
    // ...
    
    weatherIsGood: () => ({ 
        // ...
        $default: true
        // ...
    })

    // ...
}
```     

#### Custom functional action

Les clés d'une propriété fonctionnelle qui ne sont pas $default, $apply ou $model permettent de définir des actions fonctionnelles.

Ces dernières ont le rôle de modifier l'état de la propriété fonctionnelle.

Elles prennent la forme d'une fonction recevant un payload et une référence vers la propriété devant retourner la nouvelle valeur d'état de la propriété fonctionnelle.

```js
{
    // ...

    spacecraft: { 
        // ...
        addPilote: (payload, self) => ({
            ...self,
            hasPilote : true,
        })

        // ...

        updateName: (payload, self) => ({
            ...self,
            name : payload,
        })
        // ...
    }

    // ...

    weatherIsGood: { 
        // ...
        beatTheStorm: (payload, self) => false
        // ...
    }
    
    // ...
}
```  



#### `$apply`

La clé $apply d'une propriété fonctionnelle permet de calculer les contraintes de données qui lui sont liées. 

Celle-ci contient une callback qui reçoit une référence vers sa propriété fonctionnelle cible, vers son module courant et vers la racine du store, permettant ainsi de définir la nouvelle selon la valeur d'autres propriétés.

Elle est appelée à chaque fois qu'une action fonctionnelle met à jour une propriété référencée dans la callback.

```js
{
    // ...

    spacecraft: {
        $apply: (self, state, rootState) => ({
            ...self,
            canFly: self.hasPilote && self.workingEngines > 0 && state.weatherIsGood
        })
    }
    
    // ...
}
```

Ainsi dans cet exemple, l'état de la propriété `spacecraft` est recalculé automatiquement via `$apply` chaque fois qu'une action fonctionnelle met à jour les propriétés `spacecraft` et `weatherIsGood`.

Il est essentiel que la fonction définie dans $apply soit une fonction pure, c'est-à-dire que les mêmes entrées produisent la même sortie (l'utilisation de fonctions aléatoires à proscrire par exemple).

#### `$model`

La clé $model d'une propriété fonctionnelle permet de définir un accesseur bi-directionnel.

Ce mécanisme est particulièrement utile pour utiliser `v-model` plutôt qu'une paire de prop/listener.

$model reçoit un objet `{ action, value }` où `action` est le nom de d'une action fonctionnelle liée à la propriété à définir en tant que setter.

La sous-clé `value` contient une fonction recevant la référence de l'état de la propriété et retournant la valeur que le getter devra renvoyer.

Cette utilisation est détaillée dans la section "Injection dans le composant".

```js
{
    spacecraft: {
        //...
        $model: {
            action: "updateName",
            value: self => self.name
        }
        //...
    }
}
```

Dans cet exemple, l'accesseur crée (spacecraft$model) permettra ainsi de manipuler le nom du spacecraft en lecture/écriture.

### `VuexFunctionalParadigm` instance

Avant de pouvoir injecter le store fonctionnel dans le store Vuex, il faut d'abord le générer des déclarations fonctionnelles.

Celles-ci peuvent être modularisées.

```js
import VuexFunctionalParadigm from "vuex-functional-paradigm";

import rootLogic from "root.logic.js"; // functional delecration from extern file

export default new VuexFunctionalParadigm({
    "": rootLogic, // root module
    SpaceModule: { // functional declaration of our example module
        spacecraft: { ... },
        weatherIsGood: { ... }
    }
});
```

A l'instanciation de VuexFunctionalParadigm, les dépendances contenant dans les clés $apply des propriétés fonctionnelles de chaque module sont calculés.

### Store injection

Une fois que les déclarations fonctionnelles ont été parsées, il faut inclure le store fonctionnel dans le store Vuex.

```js
import Vue from "vue";
import Vuex from "vuex";
import FunctionalParadigmInstance from "./functional"; // the VuexFunctionalParadigm instance

Vue.use(Vuex);

const FunctionalRootStore = FunctionalParadigmInstance.getRootStore();
const FunctionalSpaceStore = FunctionalParadigmInstance.getStore("SpaceModule");

export default new Vuex.Store({
    state: {
        ...FunctionalRootStore.state
    },
    getters: {
        ...FunctionalRootStore.getters
    },
    mutations: {
        ...FunctionalRootStore.mutations
    },
    actions: {
        ...FunctionalRootStore.actions,

        // You can still define custom imperative action to orchestrate functional actions

        baptizeTheSpacecraftUnderTheStorm() {
            this.dispatch("SpaceModule/beatTheStorm", null);
            this.dispatch("SpaceModule/updateName", "Millennium Falcon");
        },
    },
    modules: {
        SpaceModule: {
            state: {
                ...FunctionalSpaceStore.state
            },
            getters: {
                ...FunctionalSpaceStore.getters
            },
            mutations: {
                ...FunctionalSpaceStore.mutations
            },
            actions: {
                ...FunctionalSpaceStore.actions
            }
    }
});
```

### Component injection

Maintenant que le store est opérationnel, il suffit de l'injecter dans un composant.

```vue
<template> ... </template>

<script>
import store from "./store"; // the Vuex.Store instance
import FunctionalParadigm from "./functional"; // the VuexFunctionalParadigm instance

const functionalHelpers = FunctionalParadigm.getHelpers("SpaceModule");
// use FunctionalParadigm.getHelpers("") or FunctionalParadigm.getRootHelpers() for root module

export default {
    name: "SpaceComponent",
    beforeCreate() {
        FunctionalParadigm.bindStore(this, store); // Important : bind the store for use helpers
    },
    computed: {
        ...functionalHelpers.getters // spacecraft, spacecraft$model and weatherIsGood
    },
    methods: {
        ...functionalHelpers.actions // updateName(payload), beatTheStorm(payload)
  
        // You have to use mapActions native Vuex helper for imperative actions
    },

};
</script>
```

#### Use `$model`

Pour plus de concision, le mécanisme d'accesseur bidirectionnel offert via la clé $model des propriétés fonctionnelles peut être utilisé.

```vue
<template>
    {{ spacecraft$model }}
    <input type="text" v-model="spacecraft$model" />

    // is equivalent to

    {{ spacecraft.name }}
    <input type="text" :value="spacecraft.name" @input="updateName(spacecraft.name)" />
</template>

...
```

## Common errors

### Unstability / Non-pure function

Pour que les données demeurent cohérentes dès l'initialisation du store, il est nécessaire que l'état soit stable.

La stabilité de l'état repose sur le simple fait que les fonctions $apply doivent être pures, c'est-à-dire predictable.

En d'autres termes, il faut que `$apply($default()) === $default()` soit vérifié sur l'ensemble des propriétés fonctionnelles.

### Circular dependence

Un cas d'erreur classique est celui des dépendances circulaires.

La mise à jour automatique des $apply fonctionne grâce à un arbre de dépendance, si celui-ci s'avère contenir des cycles (et donc être finalement un graphe), votre page web plantera dans une boucle infinie.

Cas d'erreur :

```js
{
    foo: {
        $default: () => "anything",
        $apply: (self, state) => randomOperation(state.bar) 
    },
    bar: {
        $default: () => "anything",
        $apply: (self, state) => randomOperation(state.foo) 
    }   
}
```

Une bonne conception de votre arbre de dépendance entre propriété fonctionnelle est donc primordiale.

Bien qu'un mécanisme existe pour détecter les dépendances circulaires, il n'est pas infallible, resté donc vigilants.

### Unknown dependence

Autre cas d'erreur classique, celui des dépendances inconnues.

Il est souvent dû a des étourderies de frappes de clavier ou à un mauvais ciblage de la dépendance parmi vos modules.

```js
{
    typo: {
        // ...
        $apply: (self, state) => randomOperation(state.spellyng) 
        // ...
    },
    unexistingProperty: {
        // ...
        $apply: (self, state) => state.unexistingProperty 
        // ...
    },  
    unexistingModule: {
        // ...
        $apply: (self, state, rootState) => rootState.unexistingModule.property 
        // ...
    }   
}
```

## TODO

VuexFunctionalParadigm est fonctionnel mais n'est pas encore parfait. Il reste de nombreuses choses à faire pour atteindre l'excellence.

- Rajouter un non-pure check sur les $apply en mode développement
- Étoffer les tests unitaires
- Documenter les options de libraire
    - Token
    - Prefix
- Documenter le fonctionnement under-the-hood de la libraire
    - Etat par défaut
    - Mutations internes
    - Algorithme de dépendance
- Optimiser l'algorithme de dépendance via un tri topologique
- Améliorer la détection des dépendances circulaires
- Implémenter une fonction de débogage affichant l'arbre de dépendance

## Licence

MIT