var expect = require('chai').expect;
var vjv = require('../index');

describe('VarArgs To JSON',function(){
	describe('#v2j()',function(){
		it('should properly parse string, boolean, int and arrays',function(){
			var vargs = 'command -a string -b false -c 0 -d item1|item2';
			vjv.config({arraySeparator:"|",stringWrapper:'"',doubledash:false});
			var result = vjv.v2j(vargs,'command');
			expect(result).to.deep.equal({cmd:'command',a:'string',b:false,c:0,d:['item1','item2']});
		});
		it('should ignore empty fields',function(){
			var vargs = 'command -a -z "a parameter" -b -c cparam';
			vjv.config({arraySeparator:"|",stringWrapper:'"',doubledash:false});
			var result = vjv.v2j(vargs,'command');
			expect(result).to.deep.equal({cmd:'command',z:'a parameter',c:'cparam'});
		});
		it('should properly format array with default separator',function(){
			var vargs = 'command -a item1|item2';
			vjv.config({arraySeparator:"|",stringWrapper:'"',doubledash:false});
			var result = vjv.v2j(vargs,'command');
			expect(result).to.deep.equal({cmd:'command',a:['item1','item2']});
		});
		it('should properly manage custom array separator',function(){
			var vargs = 'command -a item1@item2';
			vjv.config({arraySeparator:"@"});
			var result = vjv.v2j(vargs,'command');
			expect(result).to.deep.equal({cmd:'command',a:['item1','item2']});
		});
		it('should properly manage custom string wrapper',function(){
			var vargs = 'command -a #custom string wrapper# -b #array of#@#custom string#@wrapper';
			vjv.config({stringWrapper:"#",arraySeparator:"@"});
			var result = vjv.v2j(vargs,'command');
			expect(result).to.deep.equal({cmd:'command',a:'custom string wrapper',b:['array of','custom string','wrapper']});
		});
	});
});