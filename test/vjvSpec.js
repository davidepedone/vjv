var expect = require('chai').expect;
var vjv = require('../index');

describe('VJV',function(){
	describe('#common',function(){
		it('should support double dash',function(){
			var json = {cmd:'command',a:'string',b:false,c:0,d:['item1','item2']};
			var varArgs = 'command --a string --b false --c 0 --d item1|item2';
			vjv.config({doubledash:true,arraySeparator:'|'});
			var result = vjv.j2v(json,'cmd');
			var result2 = vjv.v2j(varArgs);
			expect(result).to.equal('command --a string --b false --c 0 --d item1|item2');
			expect(result2).to.deep.equal({cmd:'command',a:'string',b:false,c:0,d:['item1','item2']});
		});
	});
});
