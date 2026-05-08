export function random(len:number){
        let options:string="qwertyuioplkjhgfdsazxcvbnm";
        let l:number=options.length;

        let ans:string="";

        for(let i=0;i<len;i++){
            ans+=options[Math.floor(Math.random()*l)];
        }

        return ans;
}