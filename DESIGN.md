#directive design

##animationcontroller

1.this directive is used for controling the whole app's animation flow, such as the enter animation and left animation.

2.this direcitve is always put on the root element of each scene which need some kind of cool animation.

3.this directive cannot do anything with itself, it should be used with other two direcitves whose names are `enteranimation` and `leftanimation`.

##enteranimation

1.this directive is used for registering element enter animation info, the info include the element