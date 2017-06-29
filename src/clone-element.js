import { extend } from './util';
import { h } from './h';

/**
 * briefy:
 *  h equals createElement of React
 *  use just the origin vnode to create a new element
 */

export function cloneElement(vnode, props) {
	return h(
		vnode.nodeName,
		extend(extend({}, vnode.attributes), props),
		arguments.length>2 ? [].slice.call(arguments, 2) : vnode.children
	);
}
