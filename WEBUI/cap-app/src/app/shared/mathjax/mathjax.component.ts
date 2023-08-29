import { Component, Input, OnInit } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss']
})
export class MathjaxComponent implements OnInit {

  @Input() content :string;

  constructor(public cs: ConfigService) { }
  mathJaxObject;

  ngOnChanges(changes: SimpleChanges) {
    // to render math equations again on content change
    if (changes['content']) {
      this.renderMath()
    }
  }
  ngOnInit() {
    setTimeout(() => {
      this.loadMathConfig()
      this.renderMath();
    });
  }

  updateMathObt(){
    this.mathJaxObject = this.cs.nativeGlobal()['MathJax'];
  }

  renderMath() {
    this.updateMathObt();
    let angObj = this;
    setTimeout(() => {
      if (angObj.mathJaxObject['Hub'] !== undefined) {
        angObj.mathJaxObject['Hub'].Queue(["Typeset", angObj.mathJaxObject.Hub], 'mathContent');
      }
    },1)
  }
  loadMathConfig() {
    this.updateMathObt();
    this.mathJaxObject.Hub.Config({
      showMathMenu: false,
      tex2jax: { inlineMath: [["$", "$"],["\\(","\\)"]],displayMath:[["$$", "$$"]] },
      menuSettings: { zoom: "Double-Click", zscale: "150%" },
      CommonHTML: { linebreaks: { automatic: true } },
      "HTML-CSS": { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } }
    });
  //   this.mathJaxObject.Hub.Config({
  //     extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],
  //     jax: ["input/TeX","output/HTML-CSS"],
  //     tex2jax: {
  //         inlineMath: [['$','$'],["\\(","\\)"]],
  //         processEscapes: true,
  //     },
  // });
  }

}
