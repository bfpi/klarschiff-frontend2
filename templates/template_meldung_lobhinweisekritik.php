<input type="hidden" name="id" value="${id}"/>
<label for="email">Empfänger</label>
<p>${zustaendigkeit}</p>
<label style="margin-bottom:3px;margin-top:15px" for="email">E-Mail-Adresse <span style="font-style:italic;color:#d81920">(maximal 75 Zeichen!)</label>
<input type="text" maxlength="75" name="email" value="${email}"/>
<label for="freitext" style="margin-top:18px;margin-bottom:3px">Freitext <span style="font-style:italic;color:#d81920">(maximal 500 Zeichen!)</span></label>
<textarea maxlength="500" name="freitext" onKeyPress="if (/msie/.test(navigator.userAgent.toLowerCase()))
      return(this.value.length < 500);"></textarea>