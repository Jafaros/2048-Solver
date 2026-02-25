# Analýza výsledků 2048-Solver

## Přehled

Tento dokument obsahuje výsledky testování a analýzy algoritmu řešitele hry 2048 s velikostí hracího pole 4×4. MinMax test byl prováděn pouze s maximální hloubkou zanoření 5.

## Výsledky strategií

### 10 iterací

| Strategie | Iterace | Úspěšnost (%) | Průměrné skóre | Nejvyšší skóre | Průměrný počet tahů | Čas testu (ms) |
| --------- | ------- | ------------- | -------------- | -------------- | ------------------- | -------------- |
| Random    | 10      | 0%            | 118,4          | 256            | 143,4               | 6              |
| Corner    | 10      | 0%            | 179,2          | 512            | 199,3               | 7              |
| MinMax    | 10      | 10%           | 1024           | 2048           | 902,2               | 136362         |

#### Průměrné tahy podle směru (10 iterací)

| Strategie | Nahoru | Dolů  | Doleva | Doprava |
| --------- | ------ | ----- | ------ | ------- |
| Random    | 37,6   | 36,3  | 37,3   | 32,2    |
| Corner    | 6,2    | 92,2  | 7,2    | 93,7    |
| MinMax    | 245,3  | 207,4 | 245,6  | 203,9   |

### 100 iterací

| Strategie | Iterace | Úspěšnost (%) | Průměrné skóre | Nejvyšší skóre | Průměrný počet tahů | Čas testu (ms) |
| --------- | ------- | ------------- | -------------- | -------------- | ------------------- | -------------- |
| Random    | 100     | 0%            | 107,84         | 256            | 139,04              | 26             |
| Corner    | 100     | 0%            | 180,16         | 512            | 192,45              | 28             |
| MinMax    | 100     | 18%           | 1121,28        | 2048           | 833,39              | 1229669        |

#### Průměrné tahy podle směru (100 iterací)

| Strategie | Nahoru | Dolů   | Doleva | Doprava |
| --------- | ------ | ------ | ------ | ------- |
| Random    | 35,27  | 33,83  | 35,37  | 34,57   |
| Corner    | 6,03   | 89,74  | 6,22   | 90,46   |
| MinMax    | 231,37 | 191,17 | 228,37 | 182,48  |

## Statistika výkonu

Statistiky jsou dopočítané z aktuálně známých hodnot ve výše uvedených tabulkách (3 strategie × 2 běhy).

| Metrika             | Minimum | Maximum | Průměr |
| ------------------- | ------- | ------- | ------ |
| Úspěšnost (%)       | 0       | 18      | 4,67   |
| Průměrné skóre      | 107,84  | 1121,28 | 455,15 |
| Nejvyšší skóre      | 256     | 2048    | 938,67 |
| Průměrný počet tahů | 139,04  | 902,2   | 401,63 |
| Čas testu (ms)      | 6       | 1229669 | 227683 |

## Závěr měření

Mimo zdokumentovaná měření jsem také prováděl testy na menších hracích polích a přišel jsem na to, že vyšší hloubka zanoření přinášela lepší výsledky a vyšší úspěšnost řešení, nevýhodou však byla mnohem vyšší výpočetní a časová náročnost, a proto jsem vyšší maximální zanoření na klasickém hracím poli o rozměrech 4×4 netestoval, ale výsledkem by určitě byla větší četnost úspěšných řešení.

Test MinMax jsem se snažil optimalizovat a dosáhl jsem snížení výpočetního času o polovinu, ale i přesto trvá celkem dlouho. Test MinMax by určitě šel optimalizovat další řadou cest, jako je například volba jiného programovacího jazyka např. C či C++, optimalizace datových struktur a výpočetních operací či výpočet na více vláknech.

Nejhůře si počínal test Random cože se nějak dalo očekávat, protože zde není žádná strategie a volí tahy náhodně. Test Corner, tedy rohový test si počínal lépe a výpočetně byl podobně náročný jako test Random a přinášel lepší průměrné výsledky. Nejlépe ze všech zhlediska úspěšnosti si počínal test MinMax, který byl jako jediný schopen hry vyhrát a dosáhnout až 5× vyššího průměrného skóre než test Corner. Výkonnostně byl však MinMax velmi slabý a neefektivní.

## Poznámky k měření

| Položka             | Význam                                                   |
| ------------------- | -------------------------------------------------------- |
| Úspěšnost (%)       | Podíl úspěšných her v rámci iterací dané strategie       |
| Průměrné skóre      | Průměr hodnoty `score` přes iterace strategie            |
| Nejvyšší skóre      | Nejvyšší hodnota `score` dosažená ve strategii           |
| Průměrný počet tahů | Součet průměrných tahů (`up/down/left/right`) na iteraci |
| Čas testu (ms)      | Celkový čas běhu všech iterací strategie                 |
