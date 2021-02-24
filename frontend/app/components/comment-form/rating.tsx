import { h, Component } from 'preact';

export type RatingProps = {
  onStarred: (rating: number) => void;
  savedRating: number;
};

export type RatingState = {
  rating: number;
  onStarred: (rating: number) => void;
};

class Rating extends Component<RatingProps, RatingState> {
  constructor(props: RatingProps) {
    super(props);
    this.state = {
      rating: props.savedRating ?? 0,
      onStarred: props.onStarred,
    };
  }

  handleClick = (e: Event, star: number) => {
    e.preventDefault();
    this.setState({
      rating: star,
    });
    this.state.onStarred(star);
  };

  render() {
    const stars: number[] = [1, 2, 3, 4, 5];

    return (
      <div>
        {stars.map((star) => (
          <button onClick={(e) => this.handleClick(e, star)}>{star}</button>
        ))}
        choosen: {this.state.rating}
      </div>
    );
  }
}

export default Rating;
