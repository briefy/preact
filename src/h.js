import { VNode } from './vnode';
import options from './options';


const stack = [];

const EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
export function h(nodeName, attributes) {
	let children=EMPTY_CHILDREN, lastSimple, child, simple, i;
	/* briefy: push the children into stack */
	for (i=arguments.length; i-- > 2; ) {
		stack.push(arguments[i]);
	}
	/* briefy: if children has been provided by attributes, 
	 * then the original VNode's children gonna be ignored.
	 */
	if (attributes && attributes.children!=null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}

	/* briefy: we just expand the children, if it contains an array
	 * so,children is just an array in preact, this is different from fb react
	 * 
	 * <div>
	 *   [1,2].map(item=>{
	 *     return <div{item}</div>
	 *   })
	 *   [3,4].map(item=>{
	 *     return <div>{item}</div>
	 *   })
	 * </div>
	 */
	while (stack.length) {
		if ((child = stack.pop()) && child.pop!==undefined) {
			for (i=child.length; i--; ) stack.push(child[i]);
		}
		else {
			if (typeof child==='boolean') child = null;

			if ((simple = typeof nodeName!=='function')) {
				if (child==null) child = '';
				else if (typeof child==='number') child = String(child);
				else if (typeof child!=='string') simple = false;
			}

			/* briefy: simple here means child is a string.
			 * so if the previous child is also a string, we can combine them
			 */
			if (simple && lastSimple) {
				children[children.length-1] += child;
			}
			else if (children===EMPTY_CHILDREN) {
				children = [child];
			}
			else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	let p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes==null ? undefined : attributes;
	p.key = attributes==null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode!==undefined) options.vnode(p);

	return p;
}
