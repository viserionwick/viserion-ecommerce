// Essentials
import { Link } from 'react-router-dom'

// Contexts
import { usePanelContext } from '../../../contexts/Panel';

// Style
import "./Panel_SizeGuide.scss";
  
const PANEL_SIZEGUIDE = () => {

  const { closePanel } = usePanelContext();

  return (
    <div className="panel_sizeGuide">
      <h4>COATS</h4>
      <p>Use the following chart to find the best fit.</p>
      <p>HEIGHT Measure from the bottom of the feet to the top of the head.</p>
      <p>CHEST Measure around the largest part of the bust and back.</p>
      <p>WAIST Measure tightly around the entire waist.</p>
      <p>HIPS Go around the body at the widest point of the hip line.</p>
      <table>
        <thead>
          <tr>
            <th>LABEL SIZE</th>
            <th>US SIZE</th>
            <th>FR SIZE</th>
            <th>UK SIZE</th>
            <th>IT SIZE</th>
            <th>CHEST <br /> (CM)</th>
            <th>WAIST <br /> (CM)</th>
            <th>SHOULDER WIDTH <br /> (CM)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>XXS</td>
            <td>32</td>
            <td>42</td>
            <td>32</td>
            <td>46</td>
            <td>84</td>
            <td>67</td>
            <td>40,4</td>
          </tr>
          <tr>
            <td>XS</td>
            <td>34</td>
            <td>44</td>
            <td>34</td>
            <td>48</td>
            <td>88</td>
            <td>71</td>
            <td>41,7</td>
          </tr>
          <tr>
            <td>S</td>
            <td>36</td>
            <td>46</td>
            <td>36</td>
            <td>50</td>
            <td>92</td>
            <td>75</td>
            <td>43</td>
          </tr>
          <tr>
            <td>M</td>
            <td>38</td>
            <td>48</td>
            <td>38</td>
            <td>52</td>
            <td>96</td>
            <td>79</td>
            <td>44,3</td>
          </tr>
          <tr>
            <td>L</td>
            <td>40</td>
            <td>50</td>
            <td>40</td>
            <td>54</td>
            <td>100</td>
            <td>83</td>
            <td>45,6</td>
          </tr>
          <tr>
            <td>XL</td>
            <td>42</td>
            <td>52</td>
            <td>42</td>
            <td>56</td>
            <td>104</td>
            <td>87</td>
            <td>46,9</td>
          </tr>
          <tr>
            <td>XXL</td>
            <td>44</td>
            <td>54</td>
            <td>44</td>
            <td>58</td>
            <td>108</td>
            <td>91</td>
            <td>48,2</td>
          </tr>
        </tbody>
      </table>

      <p>Use the following chart to find the best fit.</p>
      <p>HEIGHT Measure from the bottom of the feet to the top of the head.</p>
      <table>
        <thead>
          <tr>
            <th>LABEL SIZE</th>
            <th>MEN HEIGHT (CM)</th>
            <th>WOMEN HEIGHT (CM)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0</td>
            <td>165</td>
            <td>155</td>
          </tr>
          <tr>
            <td>1</td>
            <td>170</td>
            <td>160</td>
          </tr>
          <tr>
            <td>2</td>
            <td>175</td>
            <td>165</td>
          </tr>
          <tr>
            <td>3</td>
            <td>180</td>
            <td>170</td>
          </tr>
          <tr>
            <td>4</td>
            <td>185</td>
            <td>180</td>
          </tr>
          <tr>
            <td>5</td>
            <td>190</td>
            <td>185</td>
          </tr>
        </tbody>
      </table>

      <h2>NOT SURE ABOUT YOUR SIZE?</h2>
      <p>By contacting Client Services, I agree to my data being transferred outside of my local country/region</p>
      <a href="tel:+16468891895" className='buttonClear2'>Call Us +1 646 889 1895</a>
      <Link to="/contact" className='buttonClear2' onClick={closePanel}>Email Us</Link>
    </div>
  )
}

export default PANEL_SIZEGUIDE