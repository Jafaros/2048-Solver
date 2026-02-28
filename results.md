# Analýza výsledků 2048-Solver

## Přehled

Tento dokument obsahuje výsledky testování a analýzy algoritmu řešitele hry 2048 s velikostí hracího pole 4×4. MinMax test byl prováděn pouze s maximální hloubkou zanoření 5.

## Výsledky strategií

### 10 iterací

| Strategie | Iterace | Úspěšnost (%) | Průměrné skóre | Nejvyšší skóre | Nejnižší skóre | Průměrný počet tahů | Čas testu (ms) |
| --------- | ------- | ------------- | -------------- | -------------- | -------------- | ------------------- | -------------- |
| Random    | 10      | 0%            | 108,8          | 256            | 64             | 128,3               | 6              |
| Corner    | 10      | 0%            | 211,2          | 512            | 64             | 233,9               | 7              |
| MinMax    | 10      | 30%           | 1177,6         | 2048           | 512            | 943,2               | 136362         |

#### Průměrné tahy podle směru (10 iterací)

| Strategie | Nahoru | Dolů  | Doleva | Doprava |
| --------- | ------ | ----- | ------ | ------- |
| Random    | 27,3   | 33,2  | 32     | 35,8    |
| Corner    | 7,6    | 109,3 | 7,4    | 109,6   |
| MinMax    | 259,5  | 220,1 | 259,2  | 204,4   |

### 100 iterací

| Strategie | Iterace | Úspěšnost (%) | Průměrné skóre | Nejvyšší skóre | Nejnižší skóre | Průměrný počet tahů | Čas testu (ms) |
| --------- | ------- | ------------- | -------------- | -------------- | -------------- | ------------------- | -------------- |
| Random    | 100     | 0%            | 103,2          | 256            | 16             | 136,39              | 26             |
| Corner    | 100     | 0%            | 189,76         | 512            | 32             | 205,82              | 28             |
| MinMax    | 100     | 16%           | 1082,88        | 2048           | 256            | 881,2               | 1229669        |

#### Průměrné tahy podle směru (100 iterací)

| Strategie | Nahoru | Dolů   | Doleva | Doprava |
| --------- | ------ | ------ | ------ | ------- |
| Random    | 33,21  | 34,78  | 34,11  | 34,29   |
| Corner    | 6,61   | 95,32  | 6,42   | 97,47   |
| MinMax    | 243,31 | 204,52 | 240,31 | 193,06  |

## Statistika výkonu

Statistiky jsou dopočítané z aktuálně známých hodnot ve výše uvedených tabulkách (3 strategie × 2 běhy).

| Metrika             | Minimum | Maximum | Průměr |
| ------------------- | ------- | ------- | ------ |
| Úspěšnost (%)       | 0       | 30      | 7,67   |
| Průměrné skóre      | 103,2   | 1177,6  | 478,91 |
| Nejvyšší skóre      | 256     | 2048    | 938,67 |
| Nejnižší skóre      | 16      | 512     | 157,33 |
| Průměrný počet tahů | 128,3   | 943,2   | 421,47 |
| Čas testu (ms)      | 6       | 1229669 | 227683 |

## Závěr měření

Mimo zdokumentovaná měření jsem také prováděl testy na menších hracích polích a přišel jsem na to, že vyšší hloubka zanoření přinášela lepší výsledky a vyšší úspěšnost řešení, nevýhodou však byla mnohem vyšší výpočetní a časová náročnost, a proto jsem vyšší maximální zanoření na klasickém hracím poli o rozměrech 4×4 netestoval, ale výsledkem by určitě byla větší četnost úspěšných řešení.

Test MinMax jsem se snažil optimalizovat a dosáhl jsem snížení výpočetního času o polovinu, ale i přesto trvá celkem dlouho. Test MinMax by určitě šel optimalizovat další řadou cest, jako je například volba jiného programovacího jazyka např. C či C++, optimalizace datových struktur a výpočetních operací či výpočet na více vláknech.

Nejhůře si počínal test Random cože se nějak dalo očekávat, protože zde není žádná strategie a volí tahy náhodně. Test Corner, tedy rohový test si počínal lépe a výpočetně byl podobně náročný jako test Random a přinášel lepší průměrné výsledky. Nejlépe ze všech zhlediska úspěšnosti si počínal test MinMax, který byl jako jediný schopen hry vyhrát a dosáhnout až 5× vyššího průměrného skóre než test Corner. Výkonnostně byl však MinMax velmi slabý a neefektivní zhlediska času.

## Poznámky k měření

| Položka             | Význam                                                   |
| ------------------- | -------------------------------------------------------- |
| Úspěšnost (%)       | Podíl úspěšných her v rámci iterací dané strategie       |
| Průměrné skóre      | Průměr hodnoty `score` přes iterace strategie            |
| Nejvyšší skóre      | Nejvyšší hodnota `score` dosažená ve strategii           |
| Nejnižší skóre      | Nejnižší hodnota `score` dosažená ve strategii           |
| Průměrný počet tahů | Součet průměrných tahů (`up/down/left/right`) na iteraci |
| Čas testu (ms)      | Celkový čas běhu všech iterací strategie                 |
