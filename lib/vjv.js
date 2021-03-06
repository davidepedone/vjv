'use strict';
(function(){
	var Vjv = function(){
		this.sep = '|';
		this.wrap = '"';
		this.dash = '-';
		this.cmd = 'cmd';
		this.updateRegex = function(){
			var escapeRegExp = function(str){
				return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			};
			var eWrap = escapeRegExp(this.wrap);
			this.splitRe = new RegExp(escapeRegExp(this.sep),'g');
			this.wrapRe = new RegExp('^'+eWrap+'|'+eWrap+'$','g');
			this.argRe = new RegExp('(?:[^\\s'+eWrap+']+|'+eWrap+'[^'+eWrap+']*'+eWrap+')+','g');
		};
		this.updateRegex();
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
		if(options.hasOwnProperty('commandPrefix')){
			this.cmd = options.commandPrefix;
		}
	};
	Vjv.prototype.j2v = function(json){
		var vargs = '';
		var val = '';
		if(json.hasOwnProperty(this.cmd)){
			vargs = json[this.cmd]+' ';
		}
		for(var key in json){
			if(json.hasOwnProperty(key)){
				if(key !== this.cmd){
					this.dash = (key.length == 1)?'-':'--';
					if(json[key] instanceof Array){
						vargs += this.dash+key+' ';
						for(var i in json[key]){
							if(json[key][i].trim().match(/\s/g)){
								val = this.wrap+json[key][i]+this.wrap;
							}else{
								val = json[key][i];
							}
							vargs += (i==json[key].length - 1)?val:val+this.sep;
						}
					}else if(json[key] !== null && json[key] !== ''){
						if(typeof json[key].trim === 'function' && json[key].trim().match(/\s/g)){
							vargs += this.dash+key+' '+this.wrap+json[key]+this.wrap;
						}else{
							vargs += this.dash+key+' '+json[key];
						}
					}
					vargs += ' ';
				}
			}
		}
		return vargs.trim();
	};
	Vjv.prototype.v2j = function(vargs,command){
		var json = {};
		if(command){
			var commandRegex = '^'+command+' ';
			var re = new RegExp(commandRegex);
			var cmd = vargs.match(/^([a-zA-Z]*)\s?/)[1];
			json[this.cmd] = cmd;
			vargs = vargs.replace(re,'');
		}
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
	};
	module.exports = exports = new Vjv();
}).call(this);