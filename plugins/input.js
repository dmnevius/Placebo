/**
 * Input plugin for placebo
 * A collection of selectors for <input> elements
 *
 * Includes :checked, :disabled, :enabled, :in-range, :optional, :out-of-range, :read-only, :read-write
 */

(function(context) {

    /**
     * Checks a checkbox
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    var checked = function(e) {
            e.checked = true;
            e.setAttribute("checked", "");
            return e;
        },
        /**
         * Disables any input
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        disabled = function(e) {
            e.disabled = true;
            e.setAttribute("disabled", "");
            return e;
        },
        /**
         * Enables any input
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        enabled = function(e) {
            e.disabled = false;
            e.removeAttribute("disabled");
            return e;
        },
        /**
         * Seeds the input with a random number within its valid range
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        inRange = function(e) {
            var min = 0,
                max = 100,
                value;
            if (e.min) {
                min = Number(e.min);
            }
            if (e.max) {
                max = Number(e.max);
            }
            value = Math.floor(Math.random() * (max - min + 1) + min);
            e.value = value;
            e.setAttribute("value", value);
            return e;
        },
        /**
         * Sets the input as optional
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        optional = function(e) {
            e.required = false;
            e.removeAttribute("required");
            return e;
        },
        /**
         * Seeds the input with a random number outside of its specified range
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        outOfRange = function(e) {
            var min = 0,
                max = 100,
                value;
            if (e.min) {
                min = Number(e.min);
            }
            if (e.max) {
                max = Number(e.max);
            }
            if ((Math.floor(Math.random() * (max - min - 1)) + min) % 2 === 0) {
                value = Math.floor(Math.random() * ((min * -1) - min - 1) + (min * -1));
            } else {
                value = Math.floor(Math.random() * ((max * 2) - max - 1) + (max * 2));
            }
            e.value = value;
            e.setAttribute("value", value);
            return e;
        },
        /**
         * Set the element as read-only
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        readOnly = function(e) {
            e.readonly = true;
            e.setAttribute("read-only", "");
            return e;
        },
        /**
         * Set the element as read-write
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        readWrite = function(e) {
            e.readonly = false;
            e.removeAttribute("read-only");
            return e;
        },
        /**
         * Set the input as required
         * @param  {Object} e The target element
         * @return {Object}   The modified element
         */
        required = function(e) {
            e.required = true;
            e.setAttribute("required", "");
            return e;
        },
        /**
         * Registers the pseudo selectors in any environment
         * @param  {Object} placebo The placebo object
         * @return {Object}         The placebo object
         */
        register = function(placebo) {
            placebo.addPseudoBehavior("checked", checked);
            placebo.addPseudoBehavior("disabled", disabled);
            placebo.addPseudoBehavior("enabled", enabled);
            placebo.addPseudoBehavior("in-range", inRange);
            placebo.addPseudoBehavior("optional", optional);
            placebo.addPseudoBehavior("out-of-range", outOfRange);
            placebo.addPseudoBehavior("read-only", readOnly);
            placebo.addPseudoBehavior("read-write", readWrite);
            placebo.addPseudoBehavior("required", required);
            return placebo;
        };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = register;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return register;
        });
    } else if (typeof placebo === "function" && typeof placebo.version === "string") {
        placebo.plugin(register);
    } else if (typeof context.placebo === "function" && typeof context.placebo.version === "string") {
        context.placebo.plugin(register);
    } else {
        throw "Input.js requires Placebo!";
    }

}(this));
