var expect = require('chai').expect;
var vjv = require('../index');

describe('JSON to VarArgs',function(){
	describe('#j2v()',function(){
		it('should properly parse string, boolean, int and arrays',function(){
			var json = {cmd:'command',a:'string',b:false,cccc:0,d:['item1','item2']};
			vjv.config({arraySeparator:"|",stringWrapper:'"',commandPrefix:'cmd'});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a string -b false --cccc 0 -d item1|item2');
		});
		it('should ignore null or empty fields',function(){
			var json = {cmd:'command',a:null,b:''};
			var result = vjv.j2v(json);
			expect(result).to.equal('command');
		});
		it('should properly format array with default separator',function(){
			var json = {cmd:'command',a:['item1','item2']};
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a item1|item2');
		});
		it('should properly manage json values with spaces',function(){
			var json = {cmd:'command',a:'a value with spaces'};
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a "a value with spaces"');
		});
		it('should properly manage custom array separator',function(){
			var json = {cmd:'command',a:['item1','item2']};
			vjv.config({arraySeparator:"@"});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a item1@item2');
		});
		it('should properly manage custom string wrapper',function(){
			var json = {cmd:'command',a:'a value with spaces'};
			vjv.config({stringWrapper:"#"});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a #a value with spaces#');
		});
		it('should properly manage object spec: "It is an unordered collection of properties"',function(){
			var json = {a:'param',cmd:'command'};
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a param');
		});
		it('should properly manage custom command prefix',function(){
			var json = {a:'param',testPrefix:'command'};
			vjv.config({commandPrefix:'testPrefix'});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a param');
		});
		it('should properly manage custom string wrapper',function(){
			var json = {cmd:'command',a:'custom string wrapper',bbbb:['array of','custom string','wrapper']};
			vjv.config({stringWrapper:"#",arraySeparator:"@",commandPrefix:'cmd'});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a #custom string wrapper# --bbbb #array of#@#custom string#@wrapper');
		});
		it('should auto recognize when double dash is needed',function(){
			var json = {cmd:'command',a:'string','need-dobule':'anotherString'};
			vjv.config({arraySeparator:"|",stringWrapper:'"',commandPrefix:'cmd'});
			var result = vjv.j2v(json);
			expect(result).to.equal('command -a string --need-dobule anotherString');
		});
		it('should support JSON without command',function(){
			var json = {aa:'string',b:'string2'};
			var result = vjv.j2v(json);
			expect(result).to.equal('--aa string -b string2');
		});
	});
});