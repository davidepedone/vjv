'use strict';
(function(){
	var Vjv = function(){
		this.sep = '|';
		this.wrap = '"';
		this.dash = ' -';
		this.cmd = 'cmd';
		this.splitRe;
		this.wrapRe;
		this.argRe;
		this.updateRegex = function(){
			var escapeRegExp = function(str){
				return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			};
			var eWrap = escapeRegExp(this.wrap);
			this.splitRe = new RegExp(escapeRegExp(this.sep),'g');
			this.wrapRe = new RegExp('^'+eWrap+'|'+eWrap+'$','g');
			this.argRe = new RegExp('(?:[^\\s'+eWrap+']+|'+eWrap+'[^'+eWrap+']*'+eWrap+')+','g');
		}
	};
	Vjv.prototype.config = function(options){
		if(options.hasOwnProperty('arraySeparator')){
			this.sep = options.arraySeparator;
			this.updateRegex();
		}
		if(options.hasOwnProperty('stringWrapper')){
			this.wrap = options.stringWrapper;
			this.updateRegex();
		}
		if(options.hasOwnProperty('doubledash') && options.doubledash){
			this.dash = ' --';
		}
	};
	Vjv.prototype.debug = function(){
		return this.argRe;
	}
	Vjv.prototype.j2v = function(json,cmd){
		var vargs = '';
		if(json.hasOwnProperty(cmd)){
			vargs = json[cmd];
		}
		for(var key in json){
			if(json.hasOwnProperty(key)){
				if(key !== cmd){
					if(json[key] instanceof Array){
						vargs += this.dash+key+' ';
						for(var i in json[key]){
							vargs += (i==json[key].length - 1)?json[key][i]:json[key][i]+this.sep;
						}
					}else if(json[key] !== null && json[key] !== ''){
						if(typeof json[key].trim === 'function' && json[key].trim().match(/\s/g)){
							vargs += this.dash+key+' '+this.wrap+json[key]+this.wrap;
						}else{
							vargs += this.dash+key+' '+json[key];
						}
					}
				}
			}
		}
		return vargs;
	}
	Vjv.prototype.v2j = function(vargs,command){
		var json = {};
		var commandRegex = '^'+command+' ';
		var re = new RegExp(commandRegex);
		var cmd = vargs.match(/^([a-zA-Z]*)\s?/)[1];
		json[this.cmd] = cmd;
		vargs = vargs.replace(re,'');
		var commandArray = vargs.match(this.argRe);
		for (var i=0;i<commandArray.length;i++){
			var key = commandArray[i].replace(/^-{1,2}/,'');
			if(commandArray[i+1] && commandArray[i+1] !== '' && !commandArray[i+1].match(/^-{1,2}/)){
				var tmp = commandArray[i+1];
				if(String(tmp) === 'true' || String(tmp) === 'false'){
					json[key] = (String(tmp) === 'true');
				}else if(tmp.match(/^[0-9]+(\.[0-9]+)?$/)){
					json[key] = Number(tmp);
				}else{
					if(tmp.match(this.splitRe)){
						tmp = tmp.split(this.sep);
						for(var j=0;j<tmp.length;j++){
							tmp[j] = tmp[j].replace(this.wrapRe,'');
						}
						json[key] = tmp;
					}else{
						json[key] = tmp.replace(this.wrapRe,'');
					}
				}
				i++;
			}
		}
		return json;
	}
	module.exports = exports = new Vjv();
}).call(this);